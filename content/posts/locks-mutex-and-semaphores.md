+++
date = '2024-11-17T10:02:42-03:00'
draft = true
title = 'Locks Mutex and Semaphores'
+++

Let's talk about Locks, Mutexes, and Semaphores. They are fundamental concepts in concurrent programming, used to manage access to shared resources in multithreaded or multiprocess environments. I will explain each of them.

<!--more-->

## Locks

They are mechanisms for restricting access to certain shared resources. Only one thread can take the lock at a time, ensuring that only that thread will use the resource at that time. Locks are useful when you have a global state and want to avoid race conditions.

### Race codition

It is when two or more threads try to access the same resource at the same time, this results in unexpected behavior sometimes. See the example in Go:

```go
package main

import (
	"fmt"
	"time"
)

type BankAccount struct {
	balance int // (shared resource)
}

func (account *BankAccount) Deposit(amount int) {
	account.balance += amount
}

func (account *BankAccount) Withdraw(amount int) {
	account.balance -= amount
}

func main() {
	account := &BankAccount{balance: 1000} // start the account with 1000 in balance

    // executes the goroutines to deposit and withdraw
	for i := 0; i < 5; i++ {
		go account.Deposit(100) 
		go account.Withdraw(50) 
	}

    // gives time for the goroutines to execute
	time.Sleep(1 * time.Second)

	fmt.Println("Final Balance:", account.balance) // unexpected result
}
```

The race condition occurs because two Goroutines try to access the shared resource at the same time.
