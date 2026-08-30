// @ts-check
import { defineConfig } from "astro/config";

// Deploy target: GitHub Pages project site (AGENTS.md §19).
// https://rafistra.github.io/njawani/ — base harus sama dengan nama repo.
// Jika nanti pindah ke custom domain / user site, sesuaikan `site` dan `base`.
export default defineConfig({
  site: "https://rafistra.github.io",
  base: "/njawani/",
  trailingSlash: "always",
});
