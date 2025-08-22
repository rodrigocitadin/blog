+++
date = '2025-08-19'
draft = true
mathjax = true
title = 'Option<T> and Result<T, E> are just Monads'
toc = true
+++

This post aims to explain to you what a Monad is in simple terms, using Option and Result of the Rust language, instead of just "Monad is a Monoid in the category of Endofunctors". 

This phrase says everything, but let's step back, what are categories, endofunctors, and monoids? 

## Option

Imagine that you have a closed box with a present inside. Some day at night, you decide to open it. Your Girlfriend told you not to do that, but you are stubborn, you stay so excited about the content of the box, but when you open it, "Damnn!! It is empty", that is so frustrating.

Computers sometimes become frustrated too, so to overcome this, we have `Option<T>`, which says to us not to become so excited, because our box can be empty, and avoid the slap on the face of getting nothing

```rust
enum Option<T> {
    Some(T),
    None,
}

fn inverse(x: f64) -> Option<f64> {
    if x == 0.0 { None } else { Some(1.0 / x) }
}

inverse(2.0);          // Some(0.5)
inverse(0.0);          // None
```

This function receives a number x and transforms to the inverse form (2/1 → 1/2), but when we pass 0 to the function (0/1 → 0/1) becomes an indetermination, so we got a `None`.

> "Why do this workaround? Just return a null."

Here is the problem: sometimes a computer doesn't expect a `null` (null pointer exception mentioned), so eliminating nulls from software and introducing a pattern that says explicit when you open the box, is so pretty and useful.

The pattern becomes more and more pretty when you use `match with exhaustiviness`. We will not cover `match` here, but take this example:

```rust
fn plus_inverse(x: f64) -> Option<f64> {
    match inverse(x) { // the previous example
        Some(i) => Some(i + 1.0),
        None => None
    }
}

plus_inverse(2.0);     // Some(1.5)
plus_inverse(0.0);     // None
```

## Result

It follows the same way as Option, but instead of the box being empty, it contains a bomb. Take the example:

```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}

fn parse_number(s: &str) -> Result<i32, String> {
    s.parse::<i32>().map_err(|_| "not a number".to_string())
}

parse_number("1");     // Ok(1)
parse_number("abc");   // Err("not a number")
```

We generally use Result to handle errors and Option to handle nulls.

---

To understand Monads, I mentioned that we need to take some steps back, but where exactly? I won't delve into a full explanation of Category Theory here, only the steps leading to Monads, since the goal of this post is to keep things simple, quick, and easy to grasp.

We'll explore three approaches to explain it: a mathematical definition, an analogy in natural language, and a Rust code example.

## Objects

I thought about starting this by talking about categories, but to talk about them, we need one of the fundamental structures of categories, the Objects.

Objects are abstract things that represent something; we don't have a particular form of constructing an object, and we normally don't care about how the object is, but for visualization, imagine them as solid circles.

To take as an example, a type in Rust can be an object, i.g, `i32, String, Vec<T>`

As mentioned, objects don't value anything by themselves; they just matter something inside a category, but to illustrate this in mathematical terms, we will call them as:

> Object of a category $C$ is an element of class $Ob(C)$

## Morphisms

While the objects are solid circles, morphisms will be arrows, connecting objects.

The unique thing that a morphisms do is transform an object into another object of the same category, so when you define this function in Rust: 

```rust
fn length(s: String) -> usize
```

We are doing a morphism of and `String` to an `usize`, we can write this in mathematical terms

> a morphism $f : A \to B$ in a category $C$ is and element of the $Hom_c(A,B)$ set

Morphisms have some properties that need to be satisfied to be a morphism

- Need to be composable when types coincide
    > if $f : A \to B$ and $g : B \to C$, so $g \circ f : A \to C$
- Exist an identity: 
    > $id_A : A \to A$

## Categories

Here everything lies, our mentioned objects and morphisms just matter when they are inside a category, so uniting them, we will have in Rust types as objects, functions as morphisms, and we also need an identity (morphisms to itself).

Defining it in mathematical terms: 

> An category $C$ is a pair of $(Ob(C),Hom(C))$ 

- $Ob(C)$ is a class of objects
- For each pair of objects $A,B \in Ob(C)$, exists a set $Hom_c(A,B)$ of morphisms from $A$ for $B$
- Exists an associative composition operation
    > $\circ : Hom_c(B,C) \times Hom_c(A,B) \to Hom_c(A,C)$
- For each object $A$, exists an identity morphism $id_A \in Hom_c(A,A)$, which is neutral for the composition
 
## Functors

While morphisms maps objects to other objects in the same category, functors will map objects to other categories, like "lifting" them in the context

Take the example:

```rust
let x: Option<i32> = Some(2);
let y = x.map(|n| n + 1);
```

- Option takes a type `T` an it becomes `Option<T>`
- `map` takes a function `f: A -> B` and transforms in `map(f): Option<A> -> Option<B>`


In mathematical terms we have:

> A functor $F : C \to D$ between categories

- Function in objects: 
    > $F : Ob(C) \to Ob(D)$
- Function in morphisms: 
    > for each $f : A \to B$ in $C$, a morphisms $F(f) : F(A) \to F(B)$ in $D$, where satisfies:
    >
    > 1. $F(id_A) = id_{F(A)}$
    > 2. $F(g \circ f) = F(g) \circ F(f)$

## Endofunctors

The same as a functor, but it maps the category to itself

> $F : C \to C$

In our last example with Rust, we used an endofunctor instead of a functor, but I think that you got the point. Doing examples in Rust can be nasty

```rust
let x: Option<i32> = Some(2);
let y = x.map(|n| n + 1); // Endofunctor A -> A
```

## Monoids

## Monads

## Final Notes
