import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

import { SCHEMAS_BY_COLLECTION, ID_PATTERN } from "./lib/validation/schemas";

/**
 * Stable ID berasal dari frontmatter `id`, bukan nama file (PRD §15.2, AGENTS.md §14).
 * Entri tanpa `id` valid gagal cepat dengan pesan eksplisit (AGENTS.md §67).
 */
function stableIdLoader(collection: string) {
  return glob({
    pattern: "**/*.md",
    base: `./src/content/${collection}`,
    generateId: ({ data }) => {
      const id = data.id;
      if (typeof id !== "string" || !ID_PATTERN.test(id)) {
        throw new Error(
          `[content] ${collection}: frontmatter 'id' wajib ada dan berformat kebab-case (mis. tepa-slira).`,
        );
      }
      return id;
    },
  });
}

export const collections = {
  topics: defineCollection({
    loader: stableIdLoader("topics"),
    schema: SCHEMAS_BY_COLLECTION.topics,
  }),
  terms: defineCollection({
    loader: stableIdLoader("terms"),
    schema: SCHEMAS_BY_COLLECTION.terms,
  }),
  traditions: defineCollection({
    loader: stableIdLoader("traditions"),
    schema: SCHEMAS_BY_COLLECTION.traditions,
  }),
  regions: defineCollection({
    loader: stableIdLoader("regions"),
    schema: SCHEMAS_BY_COLLECTION.regions,
  }),
  persons: defineCollection({
    loader: stableIdLoader("persons"),
    schema: SCHEMAS_BY_COLLECTION.persons,
  }),
  works: defineCollection({
    loader: stableIdLoader("works"),
    schema: SCHEMAS_BY_COLLECTION.works,
  }),
  artifacts: defineCollection({
    loader: stableIdLoader("artifacts"),
    schema: SCHEMAS_BY_COLLECTION.artifacts,
  }),
  articles: defineCollection({
    loader: stableIdLoader("articles"),
    schema: SCHEMAS_BY_COLLECTION.articles,
  }),
  modules: defineCollection({
    loader: stableIdLoader("modules"),
    schema: SCHEMAS_BY_COLLECTION.modules,
  }),
  explorations: defineCollection({
    loader: stableIdLoader("explorations"),
    schema: SCHEMAS_BY_COLLECTION.explorations,
  }),
  collections: defineCollection({
    loader: stableIdLoader("collections"),
    schema: SCHEMAS_BY_COLLECTION.collections,
  }),
  sources: defineCollection({
    loader: stableIdLoader("sources"),
    schema: SCHEMAS_BY_COLLECTION.sources,
  }),
};
