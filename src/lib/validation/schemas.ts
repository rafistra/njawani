/**
 * Schema validasi konten (AGENTS.md §21): base schema umum + type-specific.
 * Dipakai oleh content collections (Astro) dan validasi konten mandiri (vitest).
 */
import { z } from "astro/zod";

import { COLLECTION_SECTIONS, CONTENT_STATUSES, ENTRY_TYPES, KNOWLEDGE_TYPES } from "../content/types";

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
  /**
   * Tanggal pemeriksaan editorial terakhir — opsional, ditampilkan lengkap di Context Rail.
   * Menerima Date karena YAML mem-parse `2026-08-31` tanpa kutip sebagai timestamp;
   * registry menormalkan keduanya menjadi string ISO.
   */
  reviewed: z
    .union([
      z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "reviewed harus tanggal ISO, mis. 2026-08-31"),
      z.date(),
    ])
    .optional(),
  demo: z.boolean().default(false),
  /** Editorial primitive Catatan Rasa (PRD §10.4, design.md §43) — dirender sebagai komponen khas. */
  catatan_rasa: z.string().optional(),
  /** Mitos & Konteks untuk topik yang rawan bercampur kepercayaan vs konteks (PRD §10.5). */
  mitos_konteks: z
    .object({
      kepercayaan_populer: z.string().min(1),
      konteks: z.string().min(1),
      catatan: z.string().optional(),
    })
    .optional(),
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

/** Langkah guided exploration — target = stable ID entri tujuan (opsional). */
const explorationStepSchema = z.object({
  title: z.string().min(1),
  text: z.string().optional(),
  target: z.string().optional(),
});

export const explorationSchema = coreObjectSchema.extend({
  type: z.literal("exploration"),
  steps: z.array(explorationStepSchema).default([]),
});

/**
 * Daftar istilah terkurasi Rupa-rupa Kawruh (AGENTS.md §11: Collection —
 * kurasi objek). Kelompok A–D wajib dan terkontrol; isi daftar ditulis di
 * Markdown body (AGENTS.md §12-13), bukan frontmatter.
 */
export const collectionSchema = coreObjectSchema.extend({
  type: z.literal("collection"),
  section: z.enum(COLLECTION_SECTIONS),
});

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
  collections: collectionSchema,
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
