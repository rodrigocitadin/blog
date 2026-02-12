+++
date = '2026-01-13'
draft = false
title = 'Virtual Database Sharding: A Flexible Approach'
toc = true
+++

In this post, I want to share a strategy that I've been using for the past few months to handle **database sharding**. Sharding a database usually comes with a lot of challenges, such as increasing the number of shards, handling cross-shard transactions, and deciding what data needs to be sharded and what doesn't.

Here, I will show you a way to solve the **fixed number of shards** problem. With this approach, increasing or decreasing shards becomes really easy.

## The conventional approach

When you want to shard your data between two or more databases, you first need a way to place and retrieve your data, usually using a formula like this:

> **hash(entity_id) % number_of_shards**

I will not go deep into hashing here, but when choosing your hash function, keep some key points in mind:

- **It needs to be fast** (you will use this in every call to your sharded database).
- **It needs to have a good distribution** (to avoid collisions and hotspots).

If you choose a poor hash function, you will likely end up with one database holding significantly more data than the others, usually following a gaussian distribution:

![Bad Hash Function Representation](/images/virtual-sharding/bad-hash-function.png#small)

So, if things are going well, hashing our entity ID and using the modulo of the number of shards will give us an integer to identify which database our data resides in.

- **Input (UUID):** `00db753e-4a9a-4470-81a6-15f139eab0d9`
- **Hash (SHA1):** `605da3e77fed58cc544a2c847315594eda6beb0f`
- **Decimal form:** `551249606063779469779342384473005544053591880719`
- **Mod shards:** `551249606063779469779342384473005544053591880719 % 3 = 0`

Following this path leads us to database 0 (in our case, the first database).

![Hashing without virtualization](/images/virtual-sharding/normal-sharding.png#small)

But consider what happens if we want to increase the number of shards. Your hash function result will change, and this is a **HUGE** problem.

- **Input (UUID):** `00db753e-4a9a-4470-81a6-15f139eab0d9`
- **Hash (SHA1):** `605da3e77fed58cc544a2c847315594eda6beb0f`
- **Decimal form:** `551249606063779469779342384473005544053591880719`
- **Mod shards:** `551249606063779469779342384473005544053591880719 % 4 = 3`

![Increasing shards](/images/virtual-sharding/normal-sharding-increased.png#small)

In this scenario, every time our shard count changes, our routing logic ceases to be consistent. Therefore, with every increase or decrease, we would need to recalculate all the hashes and move massive amounts of data. That doesn't sound good, right? I propose a solution.

## Virtual sharding

Instead of having just 3 or 4 shards at the start, let's have something like **1024**.

> "But how will I pay the AWS bill??? I don't have enough data for 1024 shards, are you crazy??? This is a stupid idea!!!"

Here is the trick: we will have **1024 virtual shards** (often called buckets) that point to specific physical databases, acting like a Map.

We choose 1024 because you will probably never use that many physical servers, meaning we won't need to change this number in the future. This keeps our hashing consistent, so we never have to recalculate the **hash % buckets** formula.

The only thing we change to increase or decrease physical shards is the configuration file. Then, we run a simple SQL script to migrate specific buckets of data without recalculating any hash.

---

To start, we first define our max number of shards. I will use 1024, but you can increase this number (though you probably won't need to). After this, we create a hashmap in our programming language of choice. My main language is Go, so I will use it here.

We usually call this struct a **Bucket**, but feel free to name it "Virtual Shard" or just "Shard"—you decide.

```go
const TotalBuckets = 1024

func GetBucketID(entityID string) int {
	hash := md5.Sum([]byte(entityID))
	value := binary.BigEndian.Uint32(hash[:4])
	return int(value % TotalBuckets)
}
```

> You might notice that in the code, I convert only the first 4 bytes of the hash into a uint32, whereas in the theoretical example, I treated the hash as a massive number.
>
> I do this for performance. Calculating the modulus of a huge BigInt is computationally expensive. A 32-bit integer can hold values up to ~4 billion. Since cryptographic hashes like MD5 are uniformly distributed, taking just a 4-byte slice provides enough randomness to evenly fill our 1024 buckets using native, fast CPU instructions.

And you need the Map to point to your buckets (I copied this from a project I've been working on):

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

This is enough to implement virtual sharding, but we still have an underlying problem. If we need to move our data to another shard, we might assume we have to do complex calculations. To be honest, the easiest way to solve this is to simply add a column to all your sharded tables named **bucket_id**.

Now, instead of recalculating, you just pick all data by **bucket_id** and move it based on the new configuration.

![Migrating logic illustration](/images/virtual-sharding/migrating-virtual-sharding.png#full)

This is very different from the traditional approach, where you have to recalculate your hashes, move things based on that, and so on. Here, we are not recalculating hashes or buckets; we just change the mapping.

Another benefit is that we can design our entire sharding architecture with simple moves while using just one database initially, instead of starting with two or more.

This method ensures great flexibility and low complexity.

## Some guidance

If you use this Virtual Sharding method, you first need to think about your database design. You can't just shard everything; that is not a good approach.

If you have a `Users` table, you probably don't need to shard it. Let's say you have 1,000,000 users; your database will probably handle it just fine.

But let's say you want to save a history of everything that a user has changed, like an audit log. You will have a high volume of writes here, so this is a good candidate for sharding.

For most things in your daily programmer life, you will probably not need sharding. So, be careful when deciding what to shard. This method is good but not perfect. For example, if we need to delete a user from our previous example, we would need to handle distributed transactions to ensure that after the user is deleted, their history is deleted too, even if they are in different databases.

This example might not be critical—we could just delete things in the background with a worker. But imagine you sharded your users and you work at a bank. To transfer money, you need a distributed transaction; you can't simply increase or decrease the user balance in the background eventually.

## Key notes

* You don't need to shard everything.
* Sharding is still difficult.
* SHA1 and MD5 are just examples of hashing; you can use other functions.
* With virtual sharding, you can start with just one database but stay prepared to have more.
* Virtual sharding relies on mapping, not re-hashing.
* Some good hashing algorithms are **MurmurHash** or **xxHash**. Take a look when you can.

I hope you liked this post and that it proves useful to you someday. Follow me on my [socials](https://linkedin.com/in/rodrigobcitadin) and I'll see you later. Stay safe!
