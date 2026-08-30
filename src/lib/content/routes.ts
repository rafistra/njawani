/**
 * Route resolver (PRD §17, AGENTS.md §15–16): ID → URL kanonik.
 * Jangan hard-code knowledge URL — slug dapat berubah dan base path
 * GitHub Pages harus selalu diperhitungkan (AGENTS.md §19).
 */
import type { ContentObject, EntryType } from "./types";

/**
 * Content taxonomy ≠ URL taxonomy (PRD §17.9): prefix route ditentukan
 * oleh tipe, bukan oleh folder koleksi.
 */
export const ROUTE_PREFIX: Record<EntryType, string | null> = {
  topic: "kawruh",
  term: "kawruh",
  tradition: "kawruh",
  person: "kawruh",
  work: "kawruh",
  artifact: "kawruh",
  collection: "kawruh",
  region: "daerah",
  module: "sinau",
  exploration: "jelajah",
  article: "cerita",
  source: null,
};

function astroBaseUrl(): string {
  // import.meta.env.BASE_URL tersedia saat build Astro; di luar Astro (vitest) fallback '/'.
  const env = (import.meta as unknown as { env?: { BASE_URL?: string } }).env;
  return env?.BASE_URL ?? "/";
}

/**
 * Prefix path internal dengan base path (AGENTS.md §19) — untuk link statis
 * antar-section (breadcrumb, gateway, kartu) yang tidak lewat resolver entri.
 * withBase("/") → "/njawani/"; withBase("/kawruh/") → "/njawani/kawruh/".
 */
export function withBase(path: string, base: string = astroBaseUrl()): string {
  return `${base}${path.replace(/^\/+/, "")}`;
}

/** URL kanonik entri, atau null bila tipenya tidak punya halaman publik (source). */
export function resolveEntryRoute(
  entry: Pick<ContentObject, "type" | "slug">,
  base: string = astroBaseUrl(),
): string | null {
  const prefix = ROUTE_PREFIX[entry.type];
  if (!prefix) return null;
  return `${base}${prefix}/${entry.slug}/`;
}

/** Route untuk entri pada registry berdasarkan stable ID. */
export function resolveRouteById(
  registry: { getEntry(id: string): Pick<ContentObject, "type" | "slug"> | undefined },
  id: string,
  base?: string,
): string | null {
  const entry = registry.getEntry(id);
  return entry ? resolveEntryRoute(entry, base) : null;
}
