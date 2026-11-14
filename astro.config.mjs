import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import { fileURLToPath } from "node:url";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// SITE_URL / BASE_PATH are set by the deploy workflow (GitHub Pages serves
// the site under /<repo>/). Locally both default to the root.
export default defineConfig({
  site: process.env.SITE_URL || "http://localhost:4321",
  base: process.env.BASE_PATH || "/",
  trailingSlash: "always",
  integrations: [react(), mdx()],
  // The unified processor is what lets $math$ work (remark-math → KaTeX).
  markdown: { processor: unified({ remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] }) },
  vite: {
    resolve: { alias: { "@kit": fileURLToPath(new URL("./src/kit/index.jsx", import.meta.url)) } },
  },
});
