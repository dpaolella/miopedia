# Miopedia

A personal handbook of interactive technical explainers that grows one question at a time.

**How it's used:** open this repo in Claude Code (terminal, desktop, or claude.ai/code on a
phone) and ask a question — *"why does a MILP get so much harder than an LP?"* Claude reads
what the handbook already covers, builds a new explainer (or extends one) in the house
format, links it in, and opens a PR. Merge it and the page is live.

**How it works:**

- `CLAUDE.md` — the rules Claude follows in this repo.
- `.claude/skills/explain/` — the step-by-step method for turning a question into a page.
- `LEARNER.md` — who the reader is and how they learn; Claude reads and maintains it.
- `src/content/explainers/` — the handbook itself: one folder per explainer.
- The rest is a small [Astro](https://astro.build) site that renders them.

```sh
npm ci
npm run dev       # preview locally
npm run catalog   # what's in the handbook
npm run build     # validate everything
```

Deploys to GitHub Pages on every push to `main`. One-time setup: repo **Settings → Pages →
Source: GitHub Actions**.
