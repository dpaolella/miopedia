import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// The contract every explainer must satisfy. The build fails if an entry
// breaks it, or if `prerequisites` / `related` point at a slug that doesn't exist.
const explainers = defineCollection({
  loader: glob({ pattern: "*/index.mdx", base: "./src/content/explainers" }),
  schema: z.object({
    title: z.string(),
    // Hero headline. Wrap one or two words in *asterisks* for amber italics.
    headline: z.string(),
    // One or two sentences. Shown as the lede and on the index.
    summary: z.string().max(320),
    // The question that prompted this explainer, verbatim-ish.
    question: z.string(),
    domain: z.enum([
      "optimization",
      "energy-systems",
      "math",
      "statistics",
      "machine-learning",
      "computing",
      "physics",
      "finance",
      "other",
    ]),
    // Concepts this page actually teaches (lowercase noun phrases).
    // This is what future sessions search to find what's already covered.
    concepts: z.array(z.string()).min(1),
    // Explainers the reader should have seen first.
    prerequisites: z.array(reference("explainers")).default([]),
    // Sideways links: same neighbourhood, not required reading.
    related: z.array(reference("explainers")).default([]),
    status: z.enum(["draft", "published"]).default("published"),
    created: z.coerce.date(),
    updated: z.coerce.date().optional(),
  }),
});

export const collections = { explainers };
