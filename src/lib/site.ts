import { getCollection } from "astro:content";

const base = import.meta.env.BASE_URL.replace(/\/$/, "");

/** Build an internal URL that respects the deploy base path. */
export function url(path = "/") {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p.endsWith("/") ? p : `${p}/`}`;
}

/** entry.id is "<slug>/index" or "<slug>" depending on loader version; normalise. */
export const slugOf = (id: string) => id.replace(/\/index$/, "");

export async function allExplainers() {
  const all = await getCollection("explainers");
  return all
    .filter((e) => import.meta.env.DEV || e.data.status === "published")
    .sort((a, b) => +b.data.created - +a.data.created);
}

export const DOMAIN_LABEL: Record<string, string> = {
  optimization: "Optimization",
  "energy-systems": "Energy systems",
  math: "Mathematics",
  statistics: "Statistics",
  "machine-learning": "Machine learning",
  computing: "Computing",
  physics: "Physics",
  finance: "Finance",
  other: "Everything else",
};

/** "*word*" → amber italic span. Used for hero headlines. */
export function emphasise(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}
