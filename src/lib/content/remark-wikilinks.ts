/**
 * Wiki-style internal links (PRD §18, AGENTS.md §29): `[[id]]` dan
 * `[[id|teks tampilan]]` diubah menjadi link canonical saat build.
 *
 * Plugin ini hanya mengubah bentuk markdown → link; pemetaan ID → URL
 * dibangun dari frontmatter saat config dimuat (lihat astro.config.mjs)
 * dan memakai route resolver yang sama dengan UI. Semantic graph (relation
 * frontmatter) tetap terpisah dari link graph (AGENTS.md §28).
 *
 * Wiki-link ke ID yang tidak dikenal dilaporkan sebagai warning vfile,
 * bukan error — konten tetap terbaca sebagai teks.
 */
import { visit } from "unist-util-visit";
import type { Text, Parent } from "mdast";

const WIKILINK_PATTERN =
  /\[\[([a-z0-9]+(?:-[a-z0-9]+)*)\|([^\]]+)\]\]|\[\[([a-z0-9]+(?:-[a-z0-9]+)*)\]\]/g;

interface VFileLike {
  message(message: string, node?: unknown): unknown;
}

export interface WikilinkOptions {
  /** Peta stable ID → URL kanonik (termasuk base path). */
  routeMap: Record<string, string>;
}

export function remarkWikilinks(options: WikilinkOptions) {
  const { routeMap } = options;

  return (tree: unknown, file: VFileLike) => {
    visit(tree, "text", (node: Text, index: number | undefined, parent: Parent | undefined) => {
      if (index === undefined || !parent) return;
      const value = node.value;
      if (!value.includes("[[")) return;

      const matches = [...value.matchAll(WIKILINK_PATTERN)];
      if (matches.length === 0) return;

      const replacement: Parent["children"] = [];
      let cursor = 0;

      for (const match of matches) {
        const [full, labeledId, label, plainId] = match;
        const id = labeledId ?? plainId ?? "";
        const display = labeledId && label ? label : id;
        const start = match.index ?? 0;

        if (start > cursor) {
          replacement.push({ type: "text", value: value.slice(cursor, start) });
        }

        const route = routeMap[id];
        if (route) {
          replacement.push({ type: "link", url: route, children: [{ type: "text", value: display }] });
        } else {
          file.message(`Wiki-link ke '${id}' tidak ditemukan — dirender sebagai teks biasa.`, node);
          replacement.push({ type: "text", value: display });
        }

        cursor = start + full.length;
      }

      if (cursor < value.length) {
        replacement.push({ type: "text", value: value.slice(cursor) });
      }

      parent.children.splice(index, 1, ...replacement);
      return index + replacement.length;
    });
  };
}
