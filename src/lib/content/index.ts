/**
 * Adapter Astro → registry (PRD §15.1). Satu-satunya tempat yang memanggil
 * `astro:content`; semua modul lain bekerja dengan registry murni agar
 * testable di luar Astro (AGENTS.md §49: components render; lib understands).
 *
 * Dipanggil oleh halaman saat build. Error kritis validasi dilempar sehingga
 * `astro build` gagal — build-time adalah backend Njawani (AGENTS.md §4).
 */
import { getCollection } from "astro:content";

import { formatIssues } from "../validation/errors";
import { validateRegistry } from "../validation/semantic";
import { createRegistry, type ContentRegistry, type RawContentEntry } from "./registry";

let cachedRegistry: ContentRegistry | undefined;

/** Registry dibangun sekali per proses build dan dipakai ulang oleh semua halaman. */
export async function loadRegistry(): Promise<ContentRegistry> {
  if (cachedRegistry) return cachedRegistry;

  const [
    topics,
    terms,
    traditions,
    regions,
    persons,
    works,
    artifacts,
    articles,
    modules,
    explorations,
    collections,
    sources,
  ] = await Promise.all([
    getCollection("topics"),
    getCollection("terms"),
    getCollection("traditions"),
    getCollection("regions"),
    getCollection("persons"),
    getCollection("works"),
    getCollection("artifacts"),
    getCollection("articles"),
    getCollection("modules"),
    getCollection("explorations"),
    getCollection("collections"),
    getCollection("sources"),
  ]);

  const rawEntries: RawContentEntry[] = [
    topics,
    terms,
    traditions,
    regions,
    persons,
    works,
    artifacts,
    articles,
    modules,
    explorations,
    collections,
    sources,
  ].flatMap((entries) =>
    entries.map((entry) => ({
      collection: entry.collection,
      id: entry.id,
      data: entry.data as Record<string, unknown>,
      body: entry.body,
    })),
  );

  const registry = createRegistry(rawEntries);

  const errors = validateRegistry(registry).filter((issue) => issue.severity === "error");
  if (errors.length > 0) {
    throw new Error(
      `[content] Validasi semantik gagal dengan ${errors.length} error:\n${formatIssues(errors)}`,
    );
  }

  cachedRegistry = registry;
  return registry;
}
