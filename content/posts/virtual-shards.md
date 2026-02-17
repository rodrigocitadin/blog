+++
date = '2026-02-16'
draft = false
title = 'Virtual Database Sharding: A Flexible Approach'
toc = true
+++

In this post, I want to share a strategy that I've been using for the past few months to handle **database sharding**. Sharding a database usually brings significant challenges, such as managing a growing number of shards, handling cross-shard transactions, and deciding exactly which data should be partitioned.

Here, I will demonstrate a method to solve the **fixed number of shards** problem. With this approach, scaling your shards up or down becomes significantly easier.

## The Conventional Approach

When you want to shard your data across two or more databases, you first need a deterministic way to place and retrieve your data. This is typically done using a formula like:

> **hash(entity_id) % number_of_shards**

I won't dive too deep into hashing theory here, but when choosing your hash function, keep two key requirements in mind:

* **Speed:** It must be fast, as it will be computed for every database call.
* **Distribution:** It needs a uniform distribution to avoid collisions and "hotspots" (unbalanced shards).

If you choose a poor hash function, you risk ending up with one database holding significantly more data than the others, resulting in a **Skewed Distribution** instead of the desired uniform spread.

![Bad Hash Function Representation](/images/virtual-sharding/bad-hash-function.png#small)

If things go well, hashing our entity ID and applying the modulo of the shard count gives us an integer identifying which database holds our data.

* **Input (UUID):** `00db753e-4a9a-4470-81a6-15f139eab0d9`
* **Hash (SHA1):** `605da3e77fed58cc544a2c847315594eda6beb0f`
* **Decimal form:** `551249606063779469779342384473005544053591880719`
* **Mod shards:** `...5544053591880719 % 3 = 0`

This routes us to database 0 (our first database).

![Hashing without virtualization](/images/virtual-sharding/normal-sharding.png#small)

**The Problem:** Consider what happens if we need to increase the number of shards. The result of your formula depends on the `number_of_shards`. If that variable changes, the result changes, and this is a **HUGE** problem.

* **Input (UUID):** `00db753e-4a9a-4470-81a6-15f139eab0d9`
* **...**
* **Mod shards:** `...5544053591880719 % 4 = 3`

In this scenario, as soon as the shard count changes, our routing logic breaks. Data that was in `shard 0` is now mathematically expected to be in `shard 3`. To fix this, you would need to recalculate the hash for every single record in your system and move massive amounts of data to their new locations.

![Increasing shards](/images/virtual-sharding/normal-sharding-increased.png#small)

If you have **N** shards and want to go to **N+1**, the formula changes from `modulo N` to `modulo N+1`. Almost every request will be routed to the wrong server, forcing a complete database migration.

For example:

> 3 → 4 shards → ~75% move
>
> 9 → 10 shards → ~90% move

But the real problem isn't just the data movement; it's the need to recompute the routing for every record. Even records that ultimately remain on the same shard must still be re-hashed and revalidated.

So I prefer to say:

> 3 → 4 shards → ~100% processing
>
> 9 → 10 shards → ~100% processing

## Virtual Sharding

Instead of starting with just 3 or 4 physical shards, let's start with a logical layer of **1024 virtual shards** (often called **buckets** or **vNodes**).

> "But how will I pay the AWS bill? I don't have enough data for 1024 servers! Are you crazy?"

Here is the trick: these **1024 buckets** are virtual. They act like a map that points to your actual physical databases.

We choose 1024 (or another sufficiently large number) because it is unlikely you will ever need that many physical servers. This constant allows our hashing formula (`hash % buckets`) to remain consistent forever. 

We treat the number of buckets as a fixed constant in the system. This effectively decouples logical data distribution from physical infrastructure.

When we need to add or remove physical servers, we only change the **configuration map**. We then run a script to migrate specific buckets of data. We don't need to recalculate hashes for individual rows; we simply move entire buckets.

---

To implement this, we first define our max number of virtual shards (buckets). I will use 1024. Then, we implement the mapping logic. I'll use Go for this example, but the concept applies to any language.

We'll call this structure a **Bucket**, though "Virtual Shard" or "Partition" works too.

```go
const TotalBuckets = 1024

func GetBucketID(entityID string) int {
	// MD5 is fast and provides good enough distribution for sharding
	hash := md5.Sum([]byte(entityID))
	
	// Use the first 4 bytes to create a uint32
	value := binary.BigEndian.Uint32(hash[:4])
	
	return int(value % TotalBuckets)
}

```

> **Note:** You might notice I convert only the first 4 bytes of the hash into a `uint32`. Calculating the modulus of a massive BigInt is computationally expensive. A 32-bit integer can hold values up to ~4 billion. Since cryptographic hashes like MD5 are uniformly distributed, taking a 4-byte slice provides enough randomness to evenly fill our 1024 buckets using fast, native CPU instructions.

Next, we need a Map to point these buckets to physical nodes:

```go
type ShardNode struct {
	Name string // Ex: "db-alpha", "db-beta"
	DSN  string // DB connection string
}

type ShardRange struct {
	StartBucket int
	EndBucket   int
	NodeName    string
}

type ShardMap struct {
	// Ex: Buckets [0-511] -> "db-alpha"
	Ranges []ShardRange

	// Node names to real DSNs
	Nodes map[string]string
}

func (m *ShardMap) ResolveDSN(entityID string) (string, error) {
	bucketID := GetBucketID(entityID)

	for _, r := range m.Ranges {
		if bucketID >= r.StartBucket && bucketID <= r.EndBucket {
			dsn, exists := m.Nodes[r.NodeName]
			if !exists {
				return "", fmt.Errorf("node %s not defined in configuration", r.NodeName)
			}
			return dsn, nil
		}
	}

	return "", errors.New("bucket coverage incomplete: no node found for this ID")
}

```

This code implements the routing logic. However, to make migrations truly painless, there is one critical database design tip: **Add a `bucket_id` column to your sharded tables.**

With this column indexed, migration becomes a simple `SELECT` and `INSERT`. Instead of recalculating hashes for millions of rows, you simply select all data `WHERE bucket_id = X` and move it to the new server defined in your config.

## Why is this better?

In the traditional approach, changing the shard count invalidates the location of nearly all data, forcing a total re-hashing. With virtual sharding, the "location" (the bucket) never changes; only the server hosting that bucket changes.

![Migrating logic illustration](/images/virtual-sharding/migrating-virtual-sharding.png#full)

This allows you to start your architecture with a single physical database handling all 1024 buckets. As you grow, you can split them: 512 buckets on Server A, 512 on Server B. Later, you can split further, all without changing a single line of code in your application logic, just the configuration.

The key advantage is not eliminating data movement, but making it deterministic and predictable at the bucket level.

# Comparison

Looking at the data migration visualization, the difference stands out: 

One side uses standard shards with 3 shards, while the other uses 60 virtual buckets (which can have 60 different shards).

![Shards vs Virtual Shards 1](/images/virtual-sharding/comparison_1.png#full)

We still have 60 virtual buckets, but we added one more shard and migrated less data than with re-hashing.

![Shards vs Virtual Shards 2](/images/virtual-sharding/comparison_2.png#full)

With standard sharding, adding a node usually requires re-hashing and moving a large percentage of your data (often 70–90%, depending on the change in modulo). In practice, you must still scan and recompute the hash for every record, even if some ultimately remain on the same shard.

But with Virtual Sharding, adding a node only requires moving the specific buckets assigned to the new node. The rest of the data stays put, without any re-hashing or additional CPU overhead.

## Some Guidance

If you adopt Virtual Sharding, design your database schema carefully.

* **Don't shard prematurely.** If you have a `Users` table with 1,000,000 rows, a single standard database handles that easily.
* **Shard high-volume write data.** Audit logs, transaction histories, or analytics events are prime candidates.
* **Transaction boundaries matter.** Once you shard, you lose ACID transactions across different shards. If you need to delete a User and their History (which lives on a different shard), you now need a distributed transaction strategy (like Sagas or Two-Phase Commit).

Take Take a bank as an example: transferring money between two users on different shards requires careful orchestration. You can't just rely on a simple `BEGIN TRANSACTION ... COMMIT`.


## Key Takeaways

* **Selectivity:** You don't need to shard everything.
* **Complexity:** Sharding inherently adds complexity; use it only when necessary.
* **Algorithms:** SHA1 and MD5 are examples; fast non-cryptographic hashes like **MurmurHash** or **xxHash** are excellent choices for this.
* **Flexibility:** Virtual sharding decouples your data distribution from your physical infrastructure.
* **Mapping vs. Hashing:** Virtual sharding relies on a static map, avoiding the need to re-hash data during scaling.

I hope you found this post useful. If you have questions or want to discuss system design, follow me on [socials](https://linkedin.com/in/rodrigobcitadin). Stay safe!
