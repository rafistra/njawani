/**
 * Utilitas error validasi: pesan eksplisit dengan saran "Did you mean"
 * ala AGENTS.md §67 — jangan pernah drop konten invalid secara diam-diam.
 */

/** Levenshtein distance kecil untuk saran typo ID. */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  const rows = a.length + 1;
  const cols = b.length + 1;
  let prev = Array.from({ length: cols }, (_, i) => i);
  for (let i = 1; i < rows; i++) {
    const current = [i];
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(current[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    prev = current;
  }
  return prev[cols - 1];
}

/** Saran kandidat terdekat, atau string kosong bila tidak ada yang cukup mirip. */
export function suggestSimilar(value: string, candidates: Iterable<string>, maxDistance = 3): string {
  let best: { candidate: string; distance: number } | undefined;
  for (const candidate of candidates) {
    const distance = levenshtein(value, candidate);
    if (!best || distance < best.distance) best = { candidate, distance };
  }
  if (best && best.distance <= maxDistance) {
    return ` Kemungkinan maksud: '${best.candidate}'.`;
  }
  return "";
}

export interface ValidationIssue {
  code: string;
  severity: "error" | "warning";
  message: string;
}

export function formatIssues(issues: ValidationIssue[]): string {
  return issues.map((issue) => `  [${issue.severity}] ${issue.code}: ${issue.message}`).join("\n");
}
