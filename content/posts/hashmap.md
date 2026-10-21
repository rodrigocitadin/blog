+++
date = '2026-01-13'
draft = true
title = 'HashMaps: Explanation and Implementation'
toc = true
+++

First of all, everything in this post is based on what I used for my own HashMap implementation, which will appear as an example here. You'll be able to understand the conceptual part even if you've never used Go before. We also will have concepts like **Big O Notation** that you should know to have a better understandment

If you prefer to read only the summaries and ignore all my explanations and code examples, feel free.

## What is a HashMap?

First, we need to understand what we are actually building here before looking at the code. I thought about jumping straight into the syntax, but when writing this, I noticed that understanding the underlying mechanism is the difference between just using a tool and actually mastering it. So let’s understand the concept before all.

The entire hashmap structure works on mapping **keys** to **values**, think about an "associative array." If you are using a standard array or a slice in Go, you are limited to numeric indexes like `arr[0]`. You have to know *where* the data is, or you have to iterate over everything to find it.

A hashmap changes this dynamic. You provide a meaningful key (like a `string`, `int`, or even a `struct`), and the data structure handles the heavy lifting. It takes that key, runs it through a hashing algorithm, and calculates the exact memory address where the value is stored. Think about looking for a word in a dictionary: you don't read every single page starting from the first one; you look at the index (the key) and jump straight to the definition (the value).

## Why and when you should use HashMap

When solving a problem, you probably will look to 3 paths: Use an array, use a hashmap, or any of the before. Kidding about, one of the most important things is to know when you should use hashmaps, take the example:

I have a bunch of random numbers inside a list: `[1, 7, 3, 9, 5, 11]`

With this list, my task is to find a specific number inside it, so looking through **Big O Notation**, it is fair enough to pass through the entire list to find our number, it should be **O(n)** with **n** meaning the list lenght.

But with another example, imagine that we need to store a user name and her age, that means a **key/value** situation, key is the name and value the age. Here we should use a hashmap (you can use an array too, but it is not the best solution).

on this case, it should look like: `{ "Citadin": 20, "PepeHands": 34, "Paulinho": 19... }`

---

Something interersting about hashmaps, is that under the carpet they are the same as an array, but with some "buffs" on it. let's look to an array structure in memory (in not to technical ways):

![Array Structure](/images/hashmap/array-structure.png)

To find the 4 element of the array, you uses the number 3, because when your code runs, it will look to the array start memory address, and increase by 3, that means you will fall into the 4 element. This works to any element, and that explains why looking to an array element is **O(1)**.

But what happens when you need to add a new element to it? In our example, you can't because arrays needen to be straight in memory, and we also have someone at the "4" index, so we need to move everyone to another place in memory, an this generaly is **O(n)**

My goal here is not to go deeper in arrays, but I'm just showing to you the diferrences and when you should use them.

As I said before, hashmaps are just smarter arrays, so... How our smarter array can be not good at some point? Because you can't have everything my friend, hashmaps are good to look or insert an element (not always as we will see in the next sections), but you will use more memory and more computer resources, because of our **hash function**, and we need to deal with collisions and load factor.

Here is the hashmap in memory:

![Hashmap Structure](/images/hashmap/hashmap-structure.png)

## Hash function

**Goal:** Transform an input of arbitrary size (the key) into a fixed-size integer (the hash/index).
**Good Properties:**

1. **Deterministic:** The same key must always yield the same hash.
2. **Uniform Distribution:** It must spread keys evenly across the available buckets to minimize collisions.
3. **Speed:** It needs to be computationally cheap to calculate.

* *Go Context:* Go uses sophisticated hash algorithms (often hardware-accelerated like AES) and includes a random seed per process to prevent HashDoS attacks.

## Collisions

**The Problem:** Occurs when two different keys hash to the same index. Due to the "Pigeonhole Principle," if you have more possible keys than memory slots, collisions are mathematically inevitable.
**Impact:** If not handled, data would be overwritten. A robust implementation must have a strategy to store multiple values in the same "slot" or find an alternative slot.

## Load Factor and Resizing

**Load Factor:** The ratio of *items stored* / *total buckets*.
**Resizing (Rehashing):**

* When the load factor hits a threshold (e.g., 0.75), the map must grow to maintain performance.
* **The Process:** A new, larger array is allocated, and **every single existing key** must be re-hashed to find its new position. This is an expensive **O(n)** operation.
* *Go Context:* Optimizing Go maps often involves pre-allocating size (`make(map[string]int, 1000)`) to avoid this expensive resizing during insertion.

## Main Approachs

### Separate Chaining

* Each bucket in the array points to a secondary data structure (usually a Linked List).
* If a collision occurs, the new item is simply appended to the list at that bucket.
* **Pros:** Simple to implement; the table never strictly "fills up."
* **Cons:** Poor cache locality (pointers jump around memory); extra memory overhead for pointers.

### Open Addressing

* All elements are stored within the main array itself.
* If a bucket is taken, the algorithm searches for the next available slot according to a rule (e.g., *Linear Probing* simply checks index + 1).
* **Pros:** Better CPU cache locality (data is contiguous); no extra pointer memory.
* **Cons:** Susceptible to "clustering" (long runs of occupied slots), which slows down lookups as the map fills up.

## Thread-safe

**The Reality:** Standard hashmaps (like Go's `map`) are **not** thread-safe for concurrent writes.

* **The Risk:** Reading and writing (or multiple writes) simultaneously from different goroutines will cause a race condition or a panic (`fatal error: concurrent map writes`).
* **Solutions:**
1. Use locks (`sync.Mutex` or `sync.RWMutex`).
2. Use specialized concurrent maps (like `sync.Map` for specific use cases).
3. Sharding (splitting the map into smaller segments with individual locks).

## Is always O(1)?

**Short Answer:** No, it is **amortized O(1)** (on average).
**The Worst Case:** It can degrade to **O(n)**. This happens during a "catastrophic collision" scenario where a poor hash function maps all keys to the same bucket, effectively turning the map into a linked list.
**Key Factor:** Performance relies heavily on a good hash function and an efficient collision resolution strategy.

## Performance

**Summary:** Hashmaps are the gold standard for lookups, but they aren't magic.
**Hidden Costs:**

* **Hashing:** Calculating the hash for very long string keys can be slow.
* **Memory:** They trade memory for speed (allocating empty buckets to keep collisions low).
* **Resizing:** Insertion can occasionally be slow when a resize is triggered.
**Takeaway:** For most use cases, the O(1) access time outweighs these costs, provided the map is used correctly.

## Summary

*[Link to your Repo]*
