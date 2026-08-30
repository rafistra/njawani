/**
 * Validasi semantik (PRD §16.2, AGENTS.md §22, §27): memastikan data masuk
 * akal di dalam sistem — bukan hanya bentuknya yang benar.
 * Error kritis menggagalkan build produksi; orphan hanya warning.
 */
import { getRelationType, RELATION_TYPE_KEYS } from "../../data/relation-types/relation-types";
import { resolveEntryRoute } from "../content/routes";
import type { ContentRegistry } from "../content/registry";
import { isKnowledgeType } from "./schemas";
import { suggestSimilar, type ValidationIssue } from "./errors";

function detectHierarchicalCycles(edges: { source: string; target: string }[]): string[][] {
  const adjacency = new Map<string, string[]>();
  for (const edge of edges) {
    const list = adjacency.get(edge.source) ?? [];
    list.push(edge.target);
    adjacency.set(edge.source, list);
  }

  const cycles: string[][] = [];
  const seenCycles = new Set<string>();
  const visiting = new Set<string>();
  const stack: string[] = [];

  const visit = (node: string) => {
    if (visiting.has(node)) {
      const start = stack.indexOf(node);
      const cycle = [...stack.slice(start), node];
      const key = [...cycle].sort().join(">");
      if (!seenCycles.has(key)) {
        seenCycles.add(key);
        cycles.push(cycle);
      }
      return;
    }
    const targets = adjacency.get(node) ?? [];
    if (targets.length === 0) return;
    visiting.add(node);
    stack.push(node);
    for (const target of targets) visit(target);
    stack.pop();
    visiting.delete(node);
  };

  for (const node of adjacency.keys()) visit(node);
  return cycles;
}

export function validateRegistry(registry: ContentRegistry): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const all = registry.getAll();
  const knownIds = new Set(all.map((entry) => entry.id));
  const sourceIds = registry.getSources().map((source) => source.id);
  const regionIds = new Set(all.filter((entry) => entry.type === "region").map((entry) => entry.id));

  for (const entry of all) {
    for (const sourceId of entry.sourceIds) {
      if (!registry.getSource(sourceId)) {
        issues.push({
          code: "broken-source",
          severity: "error",
          message: `Entri '${entry.id}' (${entry.collection}) merujuk sumber '${sourceId}' yang tidak ada.${suggestSimilar(sourceId, sourceIds)}`,
        });
      }
    }

    for (const regionId of entry.regionIds) {
      if (!regionIds.has(regionId)) {
        issues.push({
          code: "broken-region",
          severity: "error",
          message: `Entri '${entry.id}' (${entry.collection}) merujuk region '${regionId}' yang tidak ada.${suggestSimilar(regionId, [...regionIds])}`,
        });
        continue;
      }
      const region = registry.getEntry(regionId);
      if (entry.status === "published" && region?.status === "draft") {
        issues.push({
          code: "published-to-draft",
          severity: "error",
          message: `Entri published '${entry.id}' merujuk region draft '${regionId}' (AGENTS.md §65).`,
        });
      }
    }

    const seenRelations = new Set<string>();
    for (const relation of entry.relations) {
      const def = getRelationType(relation.type);
      if (!def) {
        issues.push({
          code: "unknown-relation-type",
          severity: "error",
          message: `Relation '${relation.type}' pada '${entry.id}' tidak ada di registry. Tipe valid: ${RELATION_TYPE_KEYS.join(", ")}.${suggestSimilar(relation.type, RELATION_TYPE_KEYS)}`,
        });
        continue;
      }

      if (relation.target === entry.id) {
        issues.push({
          code: "self-relation",
          severity: "error",
          message: `Entri '${entry.id}' tidak boleh ber-relasi ke dirinya sendiri (${relation.type}).`,
        });
        continue;
      }

      if (!knownIds.has(relation.target)) {
        issues.push({
          code: "broken-relation",
          severity: "error",
          message: `Relation putus: '${entry.id}' → ${relation.type} → '${relation.target}'. Target tidak ditemukan.${suggestSimilar(relation.target, knownIds)}`,
        });
        continue;
      }

      const relationKey = `${relation.type}|${relation.target}`;
      if (seenRelations.has(relationKey)) {
        issues.push({
          code: "duplicate-relation",
          severity: "error",
          message: `Relation duplikat pada '${entry.id}': ${relation.type} → '${relation.target}'.`,
        });
        continue;
      }
      seenRelations.add(relationKey);

      if (def.sourceTypes && !def.sourceTypes.includes(entry.type)) {
        issues.push({
          code: "relation-type-mismatch",
          severity: "error",
          message: `Relation '${relation.type}' tidak boleh dipakai pada tipe '${entry.type}' sebagai source ('${entry.id}'). Diizinkan: ${def.sourceTypes.join(", ")}.`,
        });
      }

      const target = registry.getEntry(relation.target);
      if (target && def.targetTypes && !def.targetTypes.includes(target.type)) {
        issues.push({
          code: "relation-type-mismatch",
          severity: "error",
          message: `Relation '${relation.type}' dari '${entry.id}' menunjuk '${target.id}' bertipe '${target.type}'. Target diizinkan: ${def.targetTypes.join(", ")}.`,
        });
      }

      if (target && entry.status === "published" && target.status === "draft") {
        issues.push({
          code: "published-to-draft",
          severity: "error",
          message: `Entri published '${entry.id}' tidak boleh ber-relasi ke entri draft '${relation.target}' (AGENTS.md §65).`,
        });
      }
    }

    if (
      entry.status === "published" &&
      !entry.demo &&
      isKnowledgeType(entry.type) &&
      entry.sourceIds.length === 0
    ) {
      issues.push({
        code: "missing-source",
        severity: "error",
        message: `Entri kanonik published '${entry.id}' wajib memiliki minimal 1 sumber (PRD §25).`,
      });
    }
  }

  // Cycle hierarki: ikuti semua authored edge hierarchical (part_of/contains).
  const hierarchicalEdges = all.flatMap((entry) =>
    entry.relations
      .filter((relation) => getRelationType(relation.type)?.group === "hierarchical")
      .map((relation) => ({ source: entry.id, target: relation.target })),
  );
  for (const cycle of detectHierarchicalCycles(hierarchicalEdges)) {
    issues.push({
      code: "hierarchy-cycle",
      severity: "error",
      message: `Cycle hierarki terdeteksi: ${cycle.join(" → ")}.`,
    });
  }

  // Route collision: dua entri published tidak boleh menghasilkan URL sama (PRD §16.2).
  const routeOwners = new Map<string, string>();
  for (const entry of registry.getPublished()) {
    const route = resolveEntryRoute(entry, "/");
    if (!route) continue;
    const owner = routeOwners.get(route);
    if (owner) {
      issues.push({
        code: "route-collision",
        severity: "error",
        message: `Route collision: '${owner}' dan '${entry.id}' sama-sama menghasilkan '${route}'.`,
      });
    } else {
      routeOwners.set(route, entry.id);
    }
  }

  // Orphan (tanpa relation keluar/masuk) hanya warning (AGENTS.md §27).
  const incoming = new Set<string>();
  for (const entry of all) {
    for (const relation of entry.relations) incoming.add(relation.target);
  }
  for (const entry of all) {
    if (entry.demo || entry.relations.length > 0 || incoming.has(entry.id)) continue;
    issues.push({
      code: "orphan-entry",
      severity: "warning",
      message: `Entri '${entry.id}' belum memiliki relation — setiap halaman harus jalan keluar ke pengetahuan lain (PRD §4.5).`,
    });
  }

  return issues;
}
