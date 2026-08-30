/**
 * Relation engine (PRD §20): membangun graph relation dari registry.
 * Editor hanya menulis satu arah — inverse digenerate otomatis (AGENTS.md §24).
 * Validitas graph dicek oleh validasi semantik; engine melewatkan relation
 * invalid (sudah dilaporkan) agar UI tetap aman.
 */
import { getRelationType } from "../../data/relation-types/relation-types";
import type { ContentRegistry } from "../content/registry";
import type { ResolvedRelation } from "../content/types";

export interface RelationGraph {
  /** Semua relation keluar per entri, termasuk inverse hasil generate (derived). */
  outgoing: Map<string, ResolvedRelation[]>;
}

function hasAuthoredEquivalent(entry: { relations: { type: string; target: string }[] }, type: string, target: string): boolean {
  return entry.relations.some((rel) => rel.type === type && rel.target === target);
}

export function buildRelationGraph(registry: ContentRegistry): RelationGraph {
  const outgoing = new Map<string, ResolvedRelation[]>();

  const push = (relation: ResolvedRelation) => {
    const list = outgoing.get(relation.source) ?? [];
    if (!list.some((existing) => existing.type === relation.type && existing.target === relation.target)) {
      list.push(relation);
      outgoing.set(relation.source, list);
    }
  };

  for (const entry of registry.getAll()) {
    for (const relation of entry.relations) {
      const def = getRelationType(relation.type);
      if (!def) continue;
      if (relation.target === entry.id || !registry.hasEntry(relation.target)) continue;

      push({ source: entry.id, type: relation.type, target: relation.target, note: relation.note, derived: false });

      const target = registry.getEntry(relation.target);
      const inverseType = def.inverse;
      // Hindari duplikasi bila editor kebetulan juga menulis sisi inverse-nya.
      if (!target || !hasAuthoredEquivalent(target, inverseType, entry.id)) {
        push({ source: relation.target, type: inverseType, target: entry.id, note: relation.note, derived: true });
      }
    }
  }

  return { outgoing };
}

/** Relation keluar sebuah entri — gabungan relation yang ditulis editor + inverse otomatis. */
export function getRelations(graph: RelationGraph, id: string): ResolvedRelation[] {
  return graph.outgoing.get(id) ?? [];
}
