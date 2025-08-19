+++
date = '2025-08-19'
draft = true
title = 'Option<T> and Result<T, E> are just Monads'
toc = true
+++

This post aims to explain to you what a Monad is in simple terms, instead of just "Monad is a Monoid in the category of Endofunctors", this phrase says everything, but let's step back, what are categories, endofunctors, and monoids? 

If you code in Rust, you've probably (99.9%) used Option or Result, but if you haven't coded in Rust or used these Types, here's quick rundown on them.

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

## Talking About Theory

### Categories

### Objects

### Morphisms

### Functors

### Endofunctors

### Monoids

### Monads

## Final Notes
