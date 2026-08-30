/**
 * Registry relation type terkontrol (PRD §20.2, AGENTS.md §23).
 * Relation tidak boleh free-form string: editor memilih dari daftar ini,
 * sistem mengetahui inverse, symmetric flag, dan kompatibilitas tipe.
 *
 * Kelompok temporal (occurs_during, emerged_during — PRD §20.2) belum
 * dimasukkan karena MVP belum punya koleksi periode.
 */

export interface RelationTypeDef {
  /** Relation inverse yang digenerate otomatis (AGENTS.md §24). */
  inverse: string;
  /** true bila relation membaca sama dua arah, mis. related_to (PRD §20.4). */
  symmetric: boolean;
  /** Kelompok relasi PRD §20.2 — dipakai untuk grouping di UI. */
  group: "hierarchical" | "contextual" | "spatial" | "language" | "cultural" | "person-work";
  /** Label Indonesia untuk UI (Relation Strip, design.md §40). */
  label: string;
  /** Label untuk sisi inverse. */
  inverseLabel: string;
  /** Pembatasan tipe source; undefined = bebas (AGENTS.md §26). */
  sourceTypes?: readonly string[];
  /** Pembatasan tipe target; undefined = bebas. */
  targetTypes?: readonly string[];
}

export const RELATION_TYPES = {
  // Hierarchical
  part_of: {
    inverse: "contains",
    symmetric: false,
    group: "hierarchical",
    label: "Bagian dari",
    inverseLabel: "Mencakup",
  },
  contains: {
    inverse: "part_of",
    symmetric: false,
    group: "hierarchical",
    label: "Mencakup",
    inverseLabel: "Bagian dari",
  },

  // Contextual
  related_to: {
    inverse: "related_to",
    symmetric: true,
    group: "contextual",
    label: "Berkaitan dengan",
    inverseLabel: "Berkaitan dengan",
  },
  associated_with: {
    inverse: "associated_with",
    symmetric: true,
    group: "contextual",
    label: "Terkait dengan",
    inverseLabel: "Terkait dengan",
  },

  // Spatial — target selalu region
  practiced_in: {
    inverse: "has_practice",
    symmetric: false,
    group: "spatial",
    label: "Dipraktikkan di",
    inverseLabel: "Memiliki praktik",
    targetTypes: ["region"],
  },
  has_practice: {
    inverse: "practiced_in",
    symmetric: false,
    group: "spatial",
    label: "Memiliki praktik",
    inverseLabel: "Dipraktikkan di",
    sourceTypes: ["region"],
  },
  originates_from: {
    inverse: "origin_of",
    symmetric: false,
    group: "spatial",
    label: "Berasal dari",
    inverseLabel: "Menjadi asal dari",
    targetTypes: ["region"],
  },
  origin_of: {
    inverse: "originates_from",
    symmetric: false,
    group: "spatial",
    label: "Menjadi asal dari",
    inverseLabel: "Berasal dari",
    sourceTypes: ["region"],
  },

  // Language
  synonym_of: {
    inverse: "synonym_of",
    symmetric: true,
    group: "language",
    label: "Sinonim dengan",
    inverseLabel: "Sinonim dengan",
  },
  antonym_of: {
    inverse: "antonym_of",
    symmetric: true,
    group: "language",
    label: "Antonim dengan",
    inverseLabel: "Antonim dengan",
  },
  variant_of: {
    inverse: "has_variant",
    symmetric: false,
    group: "language",
    label: "Varian dari",
    inverseLabel: "Memiliki varian",
  },
  has_variant: {
    inverse: "variant_of",
    symmetric: false,
    group: "language",
    label: "Memiliki varian",
    inverseLabel: "Varian dari",
  },
  formal_equivalent_of: {
    inverse: "informal_equivalent_of",
    symmetric: false,
    group: "language",
    label: "Padanan formal dari",
    inverseLabel: "Padanan informal dari",
  },
  informal_equivalent_of: {
    inverse: "formal_equivalent_of",
    symmetric: false,
    group: "language",
    label: "Padanan informal dari",
    inverseLabel: "Padanan formal dari",
  },

  // Cultural
  used_in: {
    inverse: "uses",
    symmetric: false,
    group: "cultural",
    label: "Digunakan dalam",
    inverseLabel: "Menggunakan",
  },
  uses: {
    inverse: "used_in",
    symmetric: false,
    group: "cultural",
    label: "Menggunakan",
    inverseLabel: "Digunakan dalam",
  },
  symbolizes: {
    inverse: "symbolized_by",
    symmetric: false,
    group: "cultural",
    label: "Melambangkan",
    inverseLabel: "Dilambangkan oleh",
  },
  symbolized_by: {
    inverse: "symbolizes",
    symmetric: false,
    group: "cultural",
    label: "Dilambangkan oleh",
    inverseLabel: "Melambangkan",
  },
  derived_from: {
    inverse: "basis_for",
    symmetric: false,
    group: "cultural",
    label: "Berakar dari",
    inverseLabel: "Menjadi dasar dari",
  },
  basis_for: {
    inverse: "derived_from",
    symmetric: false,
    group: "cultural",
    label: "Menjadi dasar dari",
    inverseLabel: "Berakar dari",
  },

  // Person / Work
  created_by: {
    inverse: "creator_of",
    symmetric: false,
    group: "person-work",
    label: "Dibuat oleh",
    inverseLabel: "Pencipta dari",
    targetTypes: ["person"],
  },
  creator_of: {
    inverse: "created_by",
    symmetric: false,
    group: "person-work",
    label: "Pencipta dari",
    inverseLabel: "Dibuat oleh",
    sourceTypes: ["person"],
  },
  written_by: {
    inverse: "author_of",
    symmetric: false,
    group: "person-work",
    label: "Ditulis oleh",
    inverseLabel: "Penulis dari",
    sourceTypes: ["work"],
    targetTypes: ["person"],
  },
  author_of: {
    inverse: "written_by",
    symmetric: false,
    group: "person-work",
    label: "Penulis dari",
    inverseLabel: "Ditulis oleh",
    sourceTypes: ["person"],
    targetTypes: ["work"],
  },
  influenced_by: {
    inverse: "influenced",
    symmetric: false,
    group: "person-work",
    label: "Dipengaruhi oleh",
    inverseLabel: "Memengaruhi",
  },
  influenced: {
    inverse: "influenced_by",
    symmetric: false,
    group: "person-work",
    label: "Memengaruhi",
    inverseLabel: "Dipengaruhi oleh",
  },
} satisfies Record<string, RelationTypeDef>;

export type RelationTypeName = keyof typeof RELATION_TYPES;

/** Daftar semua relation type yang valid — dipakai engine & validasi semantik. */
export const RELATION_TYPE_KEYS = Object.keys(RELATION_TYPES) as RelationTypeName[];

export function getRelationType(type: string): RelationTypeDef | undefined {
  return RELATION_TYPES[type as RelationTypeName];
}
