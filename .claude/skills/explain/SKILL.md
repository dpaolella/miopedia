---
name: explain
description: Answer a "help me understand X" question by adding to the Miopedia handbook — a new interactive explainer, or an extension of an existing one, linked into what's already there. Use for any request to explain, teach, or build intuition for a technical idea in this repo, including bare questions like "why does X happen?" or "I don't get Y".
---

# Explain

The reader asked a question. The answer is a page in the handbook, built so that it stands on
what's already there and leaves the handbook better connected than you found it.

Follow the steps in order. Steps 1–3 are cheap and decide whether the page is any good.

## 1. Find out what the handbook already knows

```sh
npm run catalog            # everything
npm run catalog -- <term>  # narrow it
```

Read `LEARNER.md`. Then open the one to three existing explainers closest to the question and
actually read them — their prose, their examples, the notation and variable names they chose.
The new page should reuse those (same example site, same symbols) wherever the ideas touch,
so the handbook reads as one book and not as a pile of independent articles.

## 2. Decide: extend, or new page

- **Extend** an existing explainer when the question is a deeper cut of an idea a page already
  owns ("but what happens when there's a tie?"). Add a section with its own interaction, in
  the place it belongs in the argument — not bolted on the end. Set `updated`.
- **New page** when it's a distinct idea someone could want to land on directly.
- **Split the prerequisite out** when answering needs a concept the handbook lacks and that
  concept is an idea in its own right. Write the smaller foundational page first, then the page
  that was asked for, with the first as its `prerequisites`. Don't go more than one level
  down per request; put deeper gaps in `LEARNER.md` under Open threads instead.

If the question is ambiguous between two genuinely different pages, ask. Otherwise choose a
scope and go — say what you chose when you report back.

## 3. Design the page before writing any of it

Write down, in your head or in the conversation, four things. If you can't, you don't
understand the topic well enough yet; go read more.

1. **The one sentence** the reader should be able to say afterwards that they couldn't before.
2. **The interaction that makes them discover it.** What do they drag, toggle, or step through,
   and what do they *see happen* that carries the idea? It should be possible to be surprised
   by it. A slider that redraws a textbook plot doesn't count.
3. **The misconception** — the plausible wrong belief this topic attracts, usually the one
   the reader's own question hints at.
4. **The closing claim.** Something true and slightly hard-won. Not a recap.

## 4. Write it

Create `src/content/explainers/<slug>/index.mdx` (plus widget `.jsx` files beside it).
`src/content/explainers/lp-corner-optimum/` is the reference implementation; read it once.

### Frontmatter (the schema in `src/content.config.ts` is authoritative)

```yaml
title: Plain descriptive title, as it appears in lists
headline: Short hero line with one *emphasised* word or phrase.
summary: One or two sentences. The lede. Says what the reader will come away with.
question: The reader's question, close to how they asked it.
domain: optimization   # see the enum in the schema; add a value there if truly needed
concepts:              # lowercase noun phrases this page actually teaches — future
  - shadow price       # sessions search these to find out what's covered
prerequisites: [lp-corner-optimum]   # slugs the reader should have read first
related: []                          # same neighbourhood, not required
created: 2026-01-31
```

### Body

Each `## Heading` is a numbered section; the layout generates the numbering, the hero, the
contents list and the link footer. Don't write an `# h1`, a table of contents, or a
"see also" list.

The usual arc — adapt it, drop what doesn't earn its place, never pad:

1. **The framing.** The tension or surprise, concretely. Often a `<Cards>` pair.
2. **The lab.** Put the main interaction early, before the formalism. The reader plays first.
3. **Why it's true.** The argument in plain language, referring back to what they just did.
   Light notation; `$inline$` and `$$display$$` maths are available, backticks make a mono
   pill for symbols and short expressions. Reach for display maths at most once or twice.
4. **The fine print.** The misconception, and the conditions under which the claim fails.
5. **What it buys you.** Where it shows up in practice; a `<Cheats>` table if there are real
   decision rules.
6. **The closing.**

Components available in MDX without importing:

| Component | Use |
| --- | --- |
| `<Lab title="…" try="…">` | Frame for a widget. `try` is the first thing the reader should do — an instruction, not a description. |
| `<Check q="…">answer</Check>` | A question they can now answer. Ask for a prediction or an explanation ("what happens if…", "why…"), never a recalled definition. One or two per page, right after the thing that makes them answerable. Ideally they can verify it in the lab. |
| `<Note>` | The takeaway callout. Bold the punchline. |
| `<Cards>` / `<Card tag="…" foot="…">` | Two things in tension, side by side. |
| `<Ref to="slug">text</Ref>` | Link to another explainer. Use it the first time the page leans on an idea that has a page. |
| `<Cheats>` / `<Rule when="…" then="…" />` | Decision rules. |

Widgets are React components imported at the top of the MDX and mounted with
`client:visible`:

```mdx
import DualityLab from "./DualityLab.jsx";

<Lab title="Loosen a constraint" try="Drag the grid limit outward and watch which number moves.">
  <DualityLab client:visible />
</Lab>
```

Read `references/widgets.md` before writing a widget, and `references/voice.md` before
writing prose.

## 5. Wire it into the handbook

- Add `<Ref>` links from the new page to the pages it leans on.
- Go back to the neighbours you read in step 1. If one of them gestures at this idea
  ("…made precise, is duality"), turn that phrase into a `<Ref>` to the new page. If one
  should now list the new page under `related`, add it.
- Update `LEARNER.md`: remove the Open thread you just closed; add threads the new page opens.

## 6. Verify — don't skip this

1. `npm run build` passes.
2. Look at it. Run `npm run dev`, open the page at desktop width and at 390px, and
   screenshot both. Operate every control at least once, by real pointer events.
3. Check the numbers: every figure quoted in prose or in a `<Check>` answer must match what
   the widget displays in that state.
4. Reread the page top to bottom as the reader. Cut any section that doesn't teach something.

## 7. Ship and report

Commit, push, open a PR (see `CLAUDE.md`). Then tell the reader, briefly: the answer to their
question in two or three sentences, what page(s) you added or changed and how they connect to
what was there, and anything you're not sure is right.
