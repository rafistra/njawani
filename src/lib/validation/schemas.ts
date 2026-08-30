/**
 * Schema validasi konten (AGENTS.md §21): base schema umum + type-specific.
 * Dipakai oleh content collections (Astro) dan validasi konten mandiri (vitest).
 */
import { z } from "astro/zod";

import { CONTENT_STATUSES, ENTRY_TYPES, KNOWLEDGE_TYPES } from "../content/types";

/** Stable ID: kebab-case, tidak bergantung folder/URL (PRD §15.2). */
export const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Relation ditulis editor sebagai satu arah; tipe divalidasi semantik terhadap registry (AGENTS.md §23). */
const authoredRelationSchema = z.object({
  type: z.string().min(1),
  target: z.string().min(1),
  note: z.string().optional(),
});

/**
 * Field dasar semua content object non-source.
 * short_definition wajib — entri kanonik minimal harus punya definisi singkat (PRD §25).
 */
const coreObjectSchema = z.object({
  id: z.string().regex(ID_PATTERN, "ID harus kebab-case, mis. tepa-slira"),
  title: z.string().min(1, "Judul tidak boleh kosong"),
  slug: z.string().regex(ID_PATTERN, "Slug harus kebab-case").optional(),
  aksara: z.string().optional(),
  short_definition: z.string().min(1, "short_definition wajib untuk entri konten"),
  aliases: z.array(z.string()).default([]),
  search_terms: z.array(z.string()).default([]),
  themes: z.array(z.string()).default([]),
  regions: z.array(z.string()).default([]),
  relations: z.array(authoredRelationSchema).default([]),
  sources: z.array(z.string()).default([]),
  status: z.enum(CONTENT_STATUSES).default("draft"),
  demo: z.boolean().default(false),
});

export const topicSchema = coreObjectSchema.extend({ type: z.literal("topic") });
export const termSchema = coreObjectSchema.extend({ type: z.literal("term") });
export const traditionSchema = coreObjectSchema.extend({ type: z.literal("tradition") });
export const personSchema = coreObjectSchema.extend({ type: z.literal("person") });
export const workSchema = coreObjectSchema.extend({ type: z.literal("work") });
export const artifactSchema = coreObjectSchema.extend({ type: z.literal("artifact") });
export const regionSchema = coreObjectSchema.extend({ type: z.literal("region") });
export const articleSchema = coreObjectSchema.extend({ type: z.literal("article") });

export const moduleSchema = coreObjectSchema.extend({
  type: z.literal("module"),
  reading_time: z.number().int().positive().optional(),
});

export const explorationSchema = coreObjectSchema.extend({ type: z.literal("exploration") });

/** Sumber pustaka: bentuk berbeda, tanpa status/relasi/region — reference-only (AGENTS.md §66). */
export const sourceSchema = z.object({
  id: z.string().regex(ID_PATTERN, "ID harus kebab-case"),
  type: z.literal("source"),
  title: z.string().min(1),
  author: z.string().optional(),
  year: z.string().optional(),
  publisher: z.string().optional(),
  url: z
    .string()
    .regex(/^https?:\/\//, "URL sumber harus dimulai dengan http(s)://")
    .optional(),
  note: z.string().optional(),
});

/** Peta koleksi folder (PRD §13) → schema-nya. Kunci = nama folder di src/content. */
export const SCHEMAS_BY_COLLECTION = {
  topics: topicSchema,
  terms: termSchema,
  traditions: traditionSchema,
  regions: regionSchema,
  persons: personSchema,
  works: workSchema,
  artifacts: artifactSchema,
  articles: articleSchema,
  modules: moduleSchema,
  explorations: explorationSchema,
  sources: sourceSchema,
} as const;

export type CollectionName = keyof typeof SCHEMAS_BY_COLLECTION;

export const COLLECTION_NAMES = Object.keys(SCHEMAS_BY_COLLECTION) as CollectionName[];

export function isKnowledgeType(type: string): type is (typeof KNOWLEDGE_TYPES)[number] {
  return (KNOWLEDGE_TYPES as readonly string[]).includes(type);
}

export function isEntryType(type: string): type is (typeof ENTRY_TYPES)[number] {
  return (ENTRY_TYPES as readonly string[]).includes(type);
}
