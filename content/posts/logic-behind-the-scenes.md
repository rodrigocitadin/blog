+++
date = '2025-07-28'
draft = false
title = 'Logic behind the scenes'
toc = true
+++

Have you questioned yourself about how math describes things? You probably have watched the legendary [video](https://www.youtube.com/watch?v=PAZTIAfaNr8) in which a professor says, "Functions describe the world." However, I am not referring to this way of thinking about math; I am discussing logic and how to represent it properly. In this post, I will teach you about **propositional logic.**

## Core

First, we have some rules and conventions, a set of symbols (logical operators), and how they interact with each other. We will also have parentheses (they work exactly as in basic math, defining precedence), and atomic formulas - typically represented by lowercase letters like p, q, and r - are the simplest, indivisible propositions.

Take a look at the operators table:

| symbol | name        | meaning         |
|--------|-------------|-----------------|
| ¬      | negation    | not             |
| ∧      | conjunction | and             |
| ∨      | disjunction | or              |
| →      | implication | if ... then     |
| ↔      | equivalence | if, and only if |

There are other symbols that we will not touch for now, but these are the main and most used, and you can see them in other ways of representation, like the **not** being **~**

### Truth tables

Every symbol will have a truth table given variables (atomic formula), and the variables usually start from the letter **p**. Take **V** and **F** to mean true and false.

Negation table:

| p | ¬p             |
|---|----------------|
| V | F              |

All other tables together:

| p | q | p ∧ q | p ∨ q | p → q | p ↔ q |
|---|---|-------|-------|-------|-------|
| V | V | V     | V     | V     | V     |
| V | F | F     | V     | F     | F     |
| F | V | F     | V     | V     | F     |
| F | F | F     | F     | V     | V     |

With all this, we can now start playing with some fun problems.

### Applying by example

> John doesn't sleep when Joseph plays the piano or Joaquin plays the guitar. If John is sleeping, can we know if Joseph is playing the piano?

We need to define the variables from this phrase, getting the most important things, so:

- p = Joseph is playing the piano
- q = Joaquin is playing the guitar
- r = John is sleeping

The problem hypothesis states that this sentence is true:

> If Joseph is playing the piano or Joaquin is playing the guitar, then John is not sleeping

Let's build a truth table to represent this and discover some new information.

| p | q | r | ¬r | p ∨ q | (p ∨ q) → (¬r) |
|---|---|---|----|-------|----------------|
| V | V | V | F  | V     | F              |
| V | V | F | V  | V     | V              |
| ∨ | F | V | F  | V     | F              |
| V | F | F | V  | V     | V              |
| F | V | V | F  | V     | F              |
| F | V | F | V  | V     | V              |
| F | F | V | F  | F     | V              |
| F | F | F | V  | F     | V              |

Focus on the seventh line, when **r** is true and **(p ∨ q) → (¬r)** is true too, this means John is sleeping and our phrase is true, and if we observe, **p** and **q** are false at this point, so this answers our question: **Joseph can't play piano while John is sleeping.**

### Natural inference

Why all this fuss about figuring out something we can infer just by reading? We've just complicated a simple problem. Yes, in this case, that's true, but what if we have 8, 20, or 1,000 variables? Good luck thinking without a truth table.

You can still think through problems mentally using basic logic, but sometimes variables can be complex and nasty, so knowing something about propositional logic can help in these cases.

Just for information, given an **n** number of atomic formulas, the number of rows will be **2^n** and the number of possible truth tables **2^(2^n)**

## Inverse, Converse, and Contrapositive

Once we define implications, we can manipulate them in different ways to test their logical structure. For a statement like:

> If it rains, then the ground is wet.

Let **p = it rains** and **q = the ground is wet** resulting in **p → q**, so the other forms are:

1. Converse:

> q → p
>
> If the ground is wet, then it rains

2. Inverse: 

> ¬p → ¬q
>
> If it doesn't rain, then the ground isn't wet

3. Contrapositive: 

> ¬q → ¬p
>
> If the ground isn't wet, then it didn't rain

Be careful not to fall into logical fallacies and syllogisms; one thing you should know is that only the **contrapositive** is logically equivalent to the original statement.

## Logical Fallacies and Syllogisms

When we argue in natural language, we start with premises we accept as true in order to logically demonstrate that our thesis is correct. A valid argument is one where, if the premises are true, the conclusion must also be true. However, it is possible to have a valid argument based on false premises, which can lead to a false conclusion. It's important to distinguish between the validity of an argument and the truth of its premises or conclusion.

Logic is powerful, but it's easy to go wrong when reasoning in natural language. Let’s look at some classic patterns — both valid and invalid.

### Affirming the antecedent

This is a valid form of argument that infers A and A → B concludes B. A classical example of this is the ***modus ponens*** in Aristotelian logic:

1. All humans are mortal
2. Socrates is a human
3. Therefore, Socrates is mortal

### Affirming the consequent

This is a fallacy that confuses implication with its converse: B and B → A concludes A.

1. If you drink, don't drive.
2. I don't drive.
3. Therefore, I should drink.

### Denying the consequent

Sometimes called ***modus tollens*** and frequently used in proofs by absurdity and irony, is the inference that A → B and ¬B concludes ¬A

1. Every rational number squared is not 2.
2. Therefore, the square root of 2 is irrational.

### Denying the antecedent

Is the fallacy of A → B and ¬A concludes ¬B

1. I Think, therefore I am.
2. Lizards don't think.
2. Therefore, lizards don't exist.

---

As we can see, these fallacies and syllogisms can be tricky if you don't think carefully, with **affirming the antecedent** and **denying the consequent** being valid arguments, while the others are invalid. We have many fallacies, and I won't list them all here, but you can find some examples here: [List of fallacies](https://en.wikipedia.org/wiki/List_of_fallacies)

## Common Types of Formulas

Some logical statements are always true, no matter what the values of their variables are. Others are always false. These are special kinds of formulas:

### Tautology

A tautology is a statement that is always true, regardless of the truth values of its components. Take **p ∨ ¬p** as an example. This says: Either p is true, or it's not. 

Its truth table:
 
| p | ¬p | p ∨ ¬p |
|---|----|--------|
| V | F  | V      |
| F | V  | V      |

Since the result is always **V**, this is a tautology. See other examples:

> p → p
>
> (p → q) ∨ (q → p)
>
> (p ∧ q) → p

These are useful when proving things: if you can rewrite a formula into a known tautology, you've proven it's always true.

### Contradiction

A contradiction is the opposite — a formula that is always false, for example: **p ∧ ¬p**

This says: p is true and not true at the same time, which is impossible, so this is a contradiction.

| p | ¬p | p ∧ ¬p |
|---|----|--------|
| V | F  | F      |
| F | V  | F      |


Other examples:

> ¬(p ∨ ¬p)
>
> (p → q) ∧ (p ∧ ¬q)

### Why they matter?

Tautologies and contradictions are critical in logic; tautologies represent valid logical truths, and contradictions represent impossible conditions and are often signs of inconsistency.

If a proof leads to a contradiction, it means something is wrong with the assumptions (this is called a reductio ad absurdum argument). In formal logic, we often test if a formula is:

1. Satisfiable (true in some cases)
2. Valid (true in all cases → tautology)
3. Unsatisfiable (never true → contradiction)

## Mathematical Rules in Logic: Associative, Commutative, Distributive

Logical operators behave like arithmetic in some ways, and the ↔ defines a tautology in this case (all cases lead to true, so they are equal).

- Commutative:

> p ∧ q ↔ q ∧ p
>
> p ∨ q ↔ q ∨ p

- Associative:

> (p ∧ q) ∧ r ↔ p ∧ (q ∧ r)
>
> (p ∨ q) ∨ r ↔ p ∨ (q ∨ r)

- Distributive:

> p ∧ (q ∨ r) ↔ (p ∧ q) ∨ (p ∧ r)
>
> p ∨ (q ∧ r) ↔ (p ∨ q) ∧ (p ∨ r)

These identities help simplify complex logical expressions, just like simplifying algebra.

## De Morgan's Laws

These are powerful rules that connect negation with ∧ and ∨:

> ¬(p ∧ q) ↔ ¬p ∨ ¬q
>
> ¬(p ∨ q) ↔ ¬p ∧ ¬q

Think of it like saying: It’s not true that I’ll eat both pizza and salad → I’ll eat neither or just one, but not both. It’s essential when manipulating negations in expressions or building normal forms (see later in this post).

### Redefining connectives

Did you know you can express all propositional logic just using a few core operators? Let’s explore how to redefine the main logical connectives using only: Disjunction **∨** and Negation **¬** or Conjunction **∧** and Negation **¬**

---

Using Only Disjunction **∨** and Negation **¬** we can rewrite:

- Conjunction (p ∧ q)

> ¬(¬p ∨ ¬q)
>
> This is De Morgan’s Law in reverse.

- Implication (p → q)

> ¬p ∨ q
>
> "If p, then q" means either p is false or q is true.

- Equivalence or Biconditional (p ↔ q)

> (¬p ∨ q) ∧ (¬q ∨ p)
>
>Equivalent to: (p → q) ∧ (q → p) — already in terms of disjunction and negation.

---

Using Only Conjunction **∧** and Negation **¬** we flip things around:

- Disjunction (p ∨ q)

> ¬(¬p ∧ ¬q)
>
> Again, applying De Morgan's Law.

- Implication (p → q)

> ¬p ∨ q becomes ¬(p ∧ ¬q)
>
> This version avoids using ∨ directly.

- Equivalence or Biconditional (p ↔ q)

> ¬((¬(p ∧ q)) ∧ (¬(¬p ∧ ¬q)))
>
> This looks complex but uses only the allowed operators.

You can check all this by constructing all these truth tables. I will not do this here because it takes time and space :)

### Why do this?

It shows functional completeness, you only need a few operators to build all of logic, and It's useful in digital logic, hardware can implement all logic with **NAND** or **NOR** gates (which are just ¬ and ∧ or ¬ and ∨). It also helps in proof theory and compiler design, where reducing to minimal forms is common. 

If you want to go further, you can also express everything using only one operator, like **NAND** or **NOR**, but I will not approach this here.

## Disjunctive Normal Form (DNF)

A formula is in Disjunctive Normal Form when it looks like:

> (p ∧ q ∧ ¬r) ∨ (¬p ∧ q ∧ r) ∨ ...

That is, it's an OR of ANDs, with literals (variables or their negations). It’s useful because it's canonical. Any truth table can be turned into a DNF, helping in automated reasoning, SAT solving, and logic circuits.

It also shows the completeness of the logic. For every truth table, we have a formula.

### To build DNF

1. Create a truth table with desired result.
2. Take each row where the output is true.
3. For each such row, write a conjunction of literals (use ¬ where the value is false).
4. OR all these conjunctions together.

And if I don't have any true output? Simple, it is a contradiction that can be represented by this symbol: ⊥

### Building a DNF

Take this truth table as an example, with **A** being the results we want:

| p | q | r | A |
|---|---|---|---|
| V | V | V | V |
| V | V | F | F |
| V | F | V | F |
| V | F | F | V |
| F | V | V | V |
| F | V | F | F |
| F | F | V | F |
| F | F | F | F |

Following the rules we defined above, let's take the 1st, 4th, and 5th lines and construct our DNF as follows:

- 1st: p ∧ q ∧ r
- 4th: p ∧ ¬q ∧ ¬r
- 5th: ¬p ∧ q ∧ r

Therefore, we have this DNF:

> (p ∧ q ∧ r) ∨ (p ∧ ¬q ∧ ¬r) ∨ (¬p ∧ q ∧ r)

## Disclaimer: Biconditional vs Logical Equivalence

It's important to clarify something that often confuses, especially when you first encounter logical symbols. You might see p ↔ q and read "p is equivalent to q", and that’s mostly fine — but technically, there’s a difference:

- p ↔ q is called a biconditional. It's a logical operator that forms a new proposition. It is true when both sides have the same truth value (both true or both false), and false otherwise.
- p ≡ q (or φ ≡ ψ) is called a logical equivalence. It's a meta-logical statement — a way of saying that two formulas always have the same truth value, no matter what values their variables take.

In short:

> p ↔ q is a statement inside the logic system.
>
> p ≡ q is a statement about the logic system.

But here’s the catch: if p ↔ q is a tautology, then p and q are logically equivalent. So, in practice (and especially in introductory logic), people often use ↔ and "equivalence" interchangeably. Just remember: one is an operator; the other is a property.

## Final Notes

I hope you've gained a better understanding of propositional logic. I love math, and I wrote this post intending to be both concise and explanatory. If you have any improvements or criticisms about this post, please contact me on [LinkedIn](https://www.linkedin.com/in/rodrigobcitadin/). Stay tuned to my social media or this blog for more posts on math, computer science, and philosophy. Stay safe, and see you soon...
