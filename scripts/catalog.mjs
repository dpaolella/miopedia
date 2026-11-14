#!/usr/bin/env node
// Prints a compact catalog of every explainer: what exists, what each teaches,
// and how they connect. Read this before writing anything new.
//   npm run catalog            → everything
//   npm run catalog -- simplex → only entries matching the term(s)
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = new URL("../src/content/explainers/", import.meta.url).pathname;
const terms = process.argv.slice(2).map((t) => t.toLowerCase());

const field = (fm, key) => (fm.match(new RegExp(`^${key}:\\s*(.+)$`, "m"))?.[1] ?? "").replace(/^["']|["']$/g, "");
const list = (fm, key) => {
  const inline = fm.match(new RegExp(`^${key}:\\s*\\[(.*)\\]`, "m"));
  if (inline) return inline[1].split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
  const block = fm.match(new RegExp(`^${key}:\\s*\\n((?:\\s+-\\s+.+\\n?)+)`, "m"));
  return block ? block[1].split("\n").map((s) => s.replace(/^\s+-\s+/, "").trim().replace(/^["']|["']$/g, "")).filter(Boolean) : [];
};

const entries = readdirSync(root, { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(root, d.name, "index.mdx")))
  .map((d) => {
    const src = readFileSync(join(root, d.name, "index.mdx"), "utf8");
    const fm = src.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
    const sections = [...src.matchAll(/^## (.+)$/gm)].map((m) => m[1]);
    return {
      slug: d.name, title: field(fm, "title"), domain: field(fm, "domain"), status: field(fm, "status") || "published",
      summary: field(fm, "summary"), question: field(fm, "question"),
      concepts: list(fm, "concepts"), prerequisites: list(fm, "prerequisites"), related: list(fm, "related"), sections,
    };
  })
  .filter((e) => terms.every((t) => JSON.stringify(e).toLowerCase().includes(t)));

if (entries.length === 0) {
  console.log(terms.length ? `No explainer matches: ${terms.join(" ")}` : "The handbook is empty.");
  process.exit(0);
}
for (const e of entries) {
  console.log(`\n${e.slug}  [${e.domain}${e.status === "draft" ? ", draft" : ""}]`);
  console.log(`  title:     ${e.title}`);
  console.log(`  asked:     ${e.question}`);
  console.log(`  teaches:   ${e.concepts.join("; ")}`);
  console.log(`  sections:  ${e.sections.join(" | ")}`);
  if (e.prerequisites.length) console.log(`  needs:     ${e.prerequisites.join(", ")}`);
  if (e.related.length) console.log(`  nearby:    ${e.related.join(", ")}`);
}
console.log(`\n${entries.length} explainer(s).`);
