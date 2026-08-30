// @ts-check
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";

import matter from "gray-matter";
import { remarkWikilinks } from "./src/lib/content/remark-wikilinks";
import { ROUTE_PREFIX } from "./src/lib/content/routes";

// Deploy target: GitHub Pages project site (AGENTS.md §19).
// https://rafistra.github.io/njawani/ — base harus sama dengan nama repo.
// Jika nanti pindah ke custom domain / user site, sesuaikan SITE dan BASE_PATH.
const SITE = "https://rafistra.github.io";
const BASE_PATH = "/njawani/";

/**
 * Peta stable ID → URL kanonik untuk wiki-link [[id]] (PRD §18).
 * Dibaca dari frontmatter saat config dimuat; pemetaan prefix route
 * memakai ROUTE_PREFIX yang sama dengan registry (satu sumber).
 */
function buildWikiRouteMap() {
  const contentRoot = fileURLToPath(new URL("./src/content", import.meta.url));
  /** @type {Record<string, string>} */
  const routeMap = {};

  for (const collection of readdirSync(contentRoot)) {
    const collectionPath = join(contentRoot, collection);
    for (const file of readdirSync(collectionPath)) {
      if (!file.endsWith(".md")) continue;
      const { data } = matter(readFileSync(join(collectionPath, file), "utf-8"));
      const id = typeof data.id === "string" ? data.id : undefined;
      const prefix =
        typeof data.type === "string" ? ROUTE_PREFIX[/** @type {keyof typeof ROUTE_PREFIX} */ (data.type)] : undefined;
      // Hanya entri published yang boleh jadi target wiki-link — draft tidak
      // punya halaman di produksi (AGENTS.md §65).
      if (!id || !prefix || data.status !== "published") continue;
      const slug = typeof data.slug === "string" ? data.slug : id;
      routeMap[id] = `${BASE_PATH}${prefix}/${slug}/`;
    }
  }

  return routeMap;
}

export default defineConfig({
  site: SITE,
  base: BASE_PATH,
  trailingSlash: "always",
  markdown: {
    remarkPlugins: [[remarkWikilinks, { routeMap: buildWikiRouteMap() }]],
  },
});
