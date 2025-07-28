+++
date = '2025-07-27'
draft = true
title = 'Logic behind the scenes'
toc = true
+++

Have you questioned yourself about how math describes things? You probably have watched the legendary [video](https://www.youtube.com/watch?v=PAZTIAfaNr8) in which a professor says, "Functions describe the world." However, I am not referring to this way of thinking about math; I am discussing logic and how to represent it properly. In this post, I will teach you about **Propositional Logic.**

## Core

First, we have some rules and conventions, a set of symbols, and how they interact with each other. Look at the table:

| symbol | name        | meaning         |
|--------|-------------|-----------------|
| ¬      | negation    | not             |
| ∧      | conjunction | and             |
| ∨      | disjunction | or              |
| →      | implication | if ... then     |
| ↔      | equivalence | if, and only if |

There are other symbols that we will not touch for now, but these are the main and most used, and you can see them in other ways of representation, like the **not** being **~**


### Truth tables

Every symbol will have a truth table given variables, and the variables usually start from leter **p**. take **V** and **F** as true and false.

Negation table:

| p | ¬p             |
|---|----------------|
| V | F              |

All other tables together

| p | q | p ∧ q | p ∨ q | p → q | p ↔ q |
|---|---|-------|-------|-------|-------|
| V | V | V     | V     | V     | V     |
| V | F | F     | V     | F     | F     |
| F | V | F     | V     | V     | F     |
| F | F | F     | F     | V     | V     |

With all this, we can now start playing with some funny problems

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

### Atomic formula and natural inference

Why all this fuss about figuring out something we can infer just by reading? We've just complicated a simple problem. Yes, in this case, that's true, but what if we have 8, 20, or 1,000 variables? Good luck thinking without a truth table.

You can still think through problems mentally using basic logic, but sometimes variables can be complex and nasty, so knowing something about propositional logic can help in these cases.

Just for information, given a **n** number of atomic formulas (the simplest, indivisible unit of a logical expression, like **p** and **q**), the number of rows will be **2^n** and the number of possible truth tables **2^(2^n)**

## Inverse, Converse, and Contrapositive

Once we define implications, we can manipulate them in different ways to test their logical structure. For a statement like:

> If it rains, then the ground is wet.

let **p = it rains** and **q = the ground is wet** resulting in **p → q**, so the other forms are:

1. Converse: **q → p**

> If the ground is wet, then it rains

2. Inverse: **¬p → ¬q** 

>If it doesn't rain, then the ground isn't wet

3. Contrapositive: **¬q → ¬p** 

>If the ground isn't wet, then it didn't rain

Be careful not to fall into logical fallacies and syllogisms; one thing you should know is that only the **contrapositive** is logically equivalent to the original statement.

## Logical Fallacies and Syllogisms

When we argue in natural language, we start with premises we accept as true in order to logically demonstrate that our thesis is correct. A valid argument is one where, if the premises are true, the conclusion must also be true. However, it is possible to have a valid argument based on false premises, which can lead to a false conclusion. It's important to distinguish between the validity of an argument and the truth of its premises or conclusion.

### Affirming the antecedent

This is a valid form of argument that infers A and A → B concludes B. A classical example of this is the ***modus ponens*** in the aristotelic logic:


1. All humans are mortal
2. Socrates is a human
3. Therefore, Socrates is mortal

### Affirming the consequent

This is a fallacy that confuses implication with its converse: B and B → A concludes A.

1. If you drink, don't drive.
2. I don't drive.
3. Therefore, I should drink.

### Denying the consequent

Sometimes called ***modus tollens*** and frequently used in proofs by absurd and irony, is the inference that A → B and ¬B concludes ¬A

1. Every rational number squared is not 2.
2. Therefore, the square root of 2 is irrational.

### Denying the antecedent

Is the fallacy of A → B and ¬A concludes ¬B

1. I Think, therefore I am.
2. Lizards don't think.
2. Therefore, lizards don't exist.

---

As we can see, these fallacies and syllogisms can be tricky if you don't think carefully, with **affirming the antecedent** and **denying the consequent** being valid arguments, while the others are invalid. We have many fallacies, and I won't list them all here, but you can find some examples here: [List of fallacies](https://en.wikipedia.org/wiki/List_of_fallacies)
