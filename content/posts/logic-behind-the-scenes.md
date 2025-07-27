+++
date = '2025-07-27'
draft = true
title = 'Logic behind the scenes'
+++

Have you questioned yourself about how math describes things? You probably have watched the legendary [video](https://www.youtube.com/watch?v=PAZTIAfaNr8) in which a professor says, "Functions describe the world." However, I am not referring to this way of thinking about math; I am discussing logic and how to represent it properly. In this post, I will teach you about **Propositional Logic** and the basics of **First-order Logic**.

## Bases

First, we have some rules and conventions, a set of symbols, and how they interact with each other. Look at the table:

| symbol | name        | meaning         |
|--------|-------------|-----------------|
| ¬      | negation    | not             |
| ∧      | conjunction | and             |
| ∨      | disjunction | or              |
| →      | implication | if ... then     |
| ↔      | equivalence | if, and only if |

There are other symbols that we will not touch for now, but these are the main and most used, and you can see them in other ways of representation, like the **not** being **~**

Every symbol will have a truth table given variables, and the variables usually start from leter **p**. take **V** and **F** as true and false.

The **NEGATION** table:

| p | ¬p             |
|---|----------------|
| V | F              |

The **CONJUNCTION** table:

| p | q | p ∧ q |
|---|---|-------|
| V | V | V     |
| V | F | F     |
| F | V | F     |
| F | F | F     |

The **DISJUNCTION** table:

| p | q | p ∨ q |
|---|---|-------|
| V | V | V     |
| V | F | V     |
| F | V | V     |
| F | F | F     |

The **IMPLICATION** table:

| p | q | p → q |
|---|---|-------|
| V | V | V     |
| V | F | F     |
| F | V | V     |
| F | F | v     |

The **EQUIVALENCE** table:

| p | q | p ↔ q |
|---|---|-------|
| V | V | V     |
| V | F | F     |
| F | V | F     |
| F | F | v     |

With all this information, we can now start playing with that. Let's take this problem:

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

Why all this fuss about figuring out something we can infer just by reading? We've just complicated a simple problem. Yes, in this case, that's true, but what if we have 8, 20, or 1,000 variables? Good luck thinking without a truth table.

Just for information, given a **n** number of atomic formulas (the simplest, indivisible unit of a logical expression, like **p** and **q**), the number of rows will be **2^n** and the number of possible truth tables **2^(2^n)**
