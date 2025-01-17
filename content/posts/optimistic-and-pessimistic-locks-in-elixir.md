+++
date = '2025-01-13T10:00:00-00:00'
draft = false
title = 'Optimistic and Pessimistic Locks in Elixir'
+++

When should I use each of them? I will smash your question with the hammer of knowledge.

<!--more-->

## Introduction

If you don't know anything about concurrency, don't worry, I'll give a brief explanation about it and probably post something more in-depth about it in the future, but for now, this little introduction will do the work.

### Concurrency

Concurrency is the concept of allowing multiple processes or threads to access and manipulate shared resources at the same time. It is common for multiple operations to attempt to access the same data simultaneously, whether for reading or writing, and this can lead to problems such as race conditions and data inconsistencies.


### Race conditions

They happen when multiple operations try to access or modify the same data simultaneously, leading to inconsistent or unexpected behavior.

### Example using Elixir IEx:

```elixir
# Agent to store state, starting with 0
{:ok, counter} = Agent.start_link(fn -> 0 end)

increment = fn ->
    # Await for a random time (max 1 sec) and get our state
    :timer.sleep(:rand.uniform(1000))
    current = Agent.get(counter, & &1)

    # Await for a random time (max 1 sec) and update our state
    :timer.sleep(:rand.uniform(1000))
    Agent.update(counter, fn _ -> current + 1 end)
end

# Execute multiple increments at the same time, sharing state
for _ <- 1..10, do: Task.async(fn -> increment.() end)
```

We are using `:time.sleep` to simulate network instability, so you will need to wait 1 second and run:

```elixir
Agent.get(counter, & &1)
```

You will probably get different results each time. The expected result without a race condition should be 10.

---

*with these concepts, you'll probably understand the rest of the post :)*

---

## Pessimistic

> If you don't know what to expect, expect the worst

That's what people say, and in most cases, they're right. If you don't know what to do ***(the best thing to do is to start knowing what to do)***, expecting the worst is a good choice, and this applies to locks.

Pessimistic Locking is a strategy that assumes conflicts will happen frequently. It locks a resource as soon as it is accessed, ensuring that no other process can modify it until the lock is released.

If you're uncertain about how often your resources will be used, opting for a pessimistic lock is likely a better choice. In ***MY OPINION***, consistency is more important than performance most of the time. *(use common sense)*.

### Use Cases:

- When there is a high likelihood of conflicts, such as when many users are accessing the same resource.
- In critical systems, like financial systems, maintaining data consistency is a top priority.

### Example using Elixir and Ecto:

```elixir
defmodule MyApp.Resource.GetWithLock do
  alias MyApp.Repo

  def get_resource_with_pessimistic_lock(id) do
    Repo.transaction(fn ->
      Repo.one(
        from r in Resource,
        where: r.id == ^id,
        lock: "FOR UPDATE"
      )
    end)
  end
end
```

### Or use Elixir default syntax

```elixir
defmodule MyApp.Resource.GetWithLock do
  alias MyApp.Repo

  def get_resource_with_pessimistic_lock(id) do
    Repo.transaction(fn ->
      Repo.get!(MyApp.Resource, id, lock: "FOR UPDATE")
    end)
  end
end
```

---

## Optimistic

> I never used this sh**

Optimistic Locking is based on the assumption that conflicts are rare. It enables multiple transactions to access a resource simultaneously and detects any conflicts when changes are being saved. To facilitate this, it employs an additional field, typically referred to as a "version," which is incremented with each modification.

### Use Cases:

- When conflicts are infrequent and performance is prioritized over immediate consistency.
- In systems characterized by high read and low write activity, such as control panels or applications that generate numerous reports.

### Example using Elixir and Ecto:

Add a `lock_version` row to your database table. 

```elixir
def change do
  alter table(:resources) do
    add :lock_version, :integer, default: 0, null: false
  end
end
```

You can use other types to `lock_version`, but I won't cover that here

Define your schema and changeset as usual, but include the `lock_version` field and utilize the `optimistic_lock` function provided by `Ecto.changeset`

```elixir
defmodule MyApp.Resource do
  use Ecto.Schema
  import Ecto.Changeset

  schema "resources" do
    field :name, :string
    field :lock_version, :integer, default: 0
  end

  def changeset(resource, attrs) do
    resource
    |> cast(attrs, [:name])
    |> optimistic_lock(:lock_version)
  end
end
```

Use it as a regular update, Ecto will do the magic for you.

```elixir
defmodule MyApp.Resource.UpdateWithLock do
  def update_resource_with_optimistic_lock(resource, params) do
    alias MyApp.Repo

    changeset = MyApp.Resource.changeset(resource, params)

    case Repo.update(changeset) do
      {:ok, updated_resource} ->
        {:ok, updated_resource}

      {:error, %Ecto.StaleEntryError{}} ->
        {:error, :conflict}
    end
  end
end
```

---

## Conclusion

That's it! Simple as a quantum computer running another computer inside Terraria underwater in the center of an erupting volcano. *this is a joke ok?*

- Consistency and conflict do occur often -> **Pessimistic Lock**
- Performance and conflict do not occur often -> **Optimistic Lock**

I hope you enjoyed it! Follow my blog or my socials for more content like this :)

[LinkedIn](https://www.linkedin.com/in/rodrigobcitadin/)
[Twitter](https://x.com/0xcitadin)
