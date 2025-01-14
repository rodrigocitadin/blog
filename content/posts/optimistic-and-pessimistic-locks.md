+++
date = '2025-01-13T10:00:00-00:00'
draft = true
title = 'Optimistic and Pessimistic Locks'
+++

When should I use each of them? I will smash your question with the hammer of knowledge, right now!

<!--more-->

## Introduction

If you don't know anything about concurrency, don't worry, I'll give a brief explanation about it and probably post something more in-depth about it in the future, but for now, this little introduction will do the work.

### Concurrency

Concurrency is the concept of allowing multiple processes or threads to access and manipulate shared resources at the same time. It is common for multiple operations to attempt to access the same data simultaneously, whether for reading or writing, and this can lead to problems such as race conditions and data inconsistencies.


### Race conditions

They happen when multiple operations try to access or modify the same data simultaneously, leading to inconsistent or unexpected behavior.


---

*with these concepts, you'll probably understand the rest of the post :)*

---

## Pessimistic

> If you don't know what to expect, expect the worst

That's what people say, and in most cases, they're right. If you don't know what to do ***(the best thing to do is to start knowing what to do)***, expecting the worst is a good choice, and this applies to locks.

