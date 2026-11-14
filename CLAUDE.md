# Miopedia

A personal handbook of interactive technical explainers. One reader: the owner of this repo.
Every page starts as a question they asked, and the handbook grows one question at a time.

Your job in this repo is almost always one of:

- **Answer a question** by adding or extending an explainer → use the `explain` skill (`.claude/skills/explain/SKILL.md`). Do this for any "explain X", "why does X", "I don't get X", "how does X work" request, even when it isn't phrased as a request for a page.
- **Improve the platform** (layout, kit, schema, tooling) → ordinary engineering; keep it small.

## How the pieces fit

| Path | What it is |
| --- | --- |
| `src/content/explainers/<slug>/index.mdx` | One explainer. Prose in MDX; frontmatter is its catalog record. |
| `src/content/explainers/<slug>/*.jsx` | That explainer's interactive widgets (React), colocated with it. |
| `src/content.config.ts` | The frontmatter schema. The build enforces it. |
| `src/components/` | Astro components usable in any MDX with no import: `Lab`, `Check`, `Note`, `Cards`/`Card`, `Ref`, `Cheats`/`Rule`. |
| `src/kit/` | React furniture for widgets, imported from `@kit`: tokens, `Axes`, `makeScale`, `useSvgDrag`, `usePlayback`, `Readout`, `Slider`, `Button`, `Verdict`… |
| `src/pages/`, `src/layouts/`, `src/styles/` | The site shell. Hero, contents, numbering, and the builds-on / leads-to footer are generated — explainers never hand-write them. |
| `LEARNER.md` | Who the reader is and how they learn. Read it before writing; update it when you learn something durable. |
| `scripts/catalog.mjs` | `npm run catalog [terms]` — what the handbook already covers. |

## Commands

```sh
npm ci                 # once per fresh checkout
npm run catalog        # list every explainer: concepts, sections, links
npm run catalog -- duality simplex   # filter
npm run dev            # local preview at http://localhost:4321
npm run build          # the test suite: schema + cross-link validation + compile
```

There are no unit tests. `npm run build` passing, plus looking at the page in a browser, is the bar.

## Rules that hold everywhere

- **The handbook is one connected thing.** Before writing, find out what exists (`npm run catalog`). Link to it rather than re-explaining it. Extend an existing page when the question is a deeper cut of the same idea; start a new page when it's a new idea.
- **Links are data.** Dependencies go in frontmatter `prerequisites`; inline mentions use `<Ref to="slug">`. Never write a raw `/slug/` href — the site is served under a base path and raw links break. Never hand-write a "leads to" list; backlinks are derived.
- **One look.** Colors and fonts come from `src/styles/global.css` and `src/kit/tokens.js`. No new palettes, UI libraries, Tailwind, or per-page restyling. If the kit lacks a piece of furniture you need twice, add it to the kit.
- **Interactions are invented per topic.** The kit holds furniture (axes, readouts, buttons), never a reusable "widget". If a page has no interaction that reveals something prose couldn't, it shouldn't be a page yet.
- **Works on a phone.** The reader often opens these on mobile. Widgets must be usable at 390px wide with touch: use `useSvgDrag` (it handles touch), keep hit targets ≥ 36px, never rely on hover.
- **Be right.** These pages are how the reader forms their mental models. Compute values in code rather than typing them into prose; check worked numbers against the widget; state the conditions under which a claim holds. If you're unsure of a fact, look it up or say so on the page.
- Slugs are lowercase-kebab, name the idea not the question (`lp-duality`, not `what-is-duality`), and never change once published.

## Shipping

`main` deploys to GitHub Pages automatically (`.github/workflows/deploy.yml`). Work on a branch, make sure `npm run build` passes, and open a PR unless told otherwise; the reader merges from their phone and the page is live a minute later.
