# Voice Examples

Short before/after snippets to calibrate prose tone. The "after" column is the handbook voice; the "before" is the kind of writing to avoid.

## Opening a section

**Avoid (generic explainer voice):**

> Welcome! In this section, we'll explore the fascinating concept of convexity. Convexity is an important mathematical property that has many applications. Let's dive in!

**Handbook voice:**

> The definition is simpler than the word: pick any two points inside the shape, draw a straight line between them. If the line stays entirely inside, the shape is convex. If any part of the line pokes outside, it's not.

The handbook voice gets to the thing immediately. No throat-clearing, no "we will explore," no "let's dive in."

## Acknowledging a misconception

**Avoid:**

> You might be wondering whether having infinite solutions makes LP harder. This is a common point of confusion that we'll address.

**Handbook voice:**

> Here's a wrinkle that trips everyone up. An LP has infinitely many feasible points. A MILP with n binary decisions has only 2ⁿ combinations. Finite! So why is the infinite problem easier than the finite one?

Name the confusion as a confusion, then spring the question. Don't soften it with "you might wonder."

## Delivering the key insight

**Avoid:**

> It can be shown that, due to the convex nature of the feasible region, any local optimum will also be a global optimum. This is a useful property.

**Handbook voice:**

> In LP, there are no local minima that aren't also global minima. You literally cannot get stuck.

Direct. Active voice. Sentence two doubles down. "It can be shown that" is dead weight.

## Closing a section

**Avoid:**

> In conclusion, LP and MILP are both important optimization techniques with different strengths and weaknesses. Choosing between them depends on your problem.

**Handbook voice:**

> The honest summary: LP is a tool, MILP is a commitment. LPs scale gracefully — you can throw a continent of hourly data at them. MILPs scale treacherously — adding one more binary can change solve time by an order of magnitude, or not at all, depending on structure.

Closings should land a real claim, not summarize. "LP is a tool, MILP is a commitment" is the kind of thing the reader will remember a week later.

## Explaining a tradeoff

**Avoid:**

> Simplex and interior-point methods each have their own pros and cons. Simplex tends to be better for some problems, while interior-point can be faster for others.

**Handbook voice:**

> Interior-point beats simplex on huge, cold, one-shot LPs with favorable structure. Simplex beats interior-point on small problems, on warm-start scenarios, and — crucially — inside MILP solvers where thousands of nearly-identical LPs need to be solved.

Specific. Concrete conditions. Names the actual tradeoff.

## Talking about the reader

**Avoid:**

> As a learner, you should think about how this applies to your work. Take a moment to consider the implications.

**Handbook voice:**

The handbook generally doesn't address the reader as a learner. It just explains things. "You" is fine when used naturally ("you can charge at any fractional rate"). It's not used to manage the reader's experience or prompt reflection. No "take a moment." No "as a learner."

## Talking about the topic

**Avoid:**

> Linear programming is a fascinating field with rich history dating back to the 1940s. Pioneers like George Dantzig developed the simplex method...

**Handbook voice:**

> There's a famous result that makes this precise: LP is in P (polynomial time, Khachiyan 1979), while MILP is NP-hard. Not because MILP has more solutions — but because the solutions have no exploitable structure connecting them.

History is fine when it's load-bearing. ("Khachiyan 1979" makes a specific point about complexity.) Throat-clearing history ("rich history," "pioneers like...") doesn't earn its place.

## Hedging

**Avoid:**

> It's generally believed that, in most cases, simplex tends to perform reasonably well on problems that aren't too large.

**Handbook voice:**

> Simplex iterations are cheap — you're updating a basis, pivoting one variable in and one out.

If the claim is solid, state it. If it has caveats, name them specifically rather than hedging the whole sentence.

## Italics and em-dashes

The handbook voice uses italics for genuine emphasis (not decoration) and em-dashes generously for parenthetical clarification or rhythm changes. Both are tools for keeping prose lively without being chatty.

> Convexity is the magic ingredient. The feasible region of an LP is convex, meaning: pick any two feasible points, draw a straight line between them, every point on that line is also feasible.

The colon-introduced clause works because it's how a person actually talks when explaining. Don't stiffen it into "specifically, the feasible region satisfies the property that..."

## When to use bold

Sparingly, for the punchline of a paragraph or section. The reader should be able to skim the bolds and get the gist. Don't bold examples or definitions — bold the *takeaway*.

> So the one-sentence answer: **convexity + linearity = no local traps, ever**. It's why LP is, in some sense, the "easiest" optimization problem there is.
