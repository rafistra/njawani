/**
 * Pipeline validasi mandiri: schema validation → registry → semantic validation.
 * Dipakai oleh test konten nyata (tests/content-validation.test.ts) sehingga
 * referensi rusak terdeteksi di CI bahkan sebelum halaman konsumen dibangun.
 */
import { createRegistry, type RawContentEntry } from "../content/registry";
import { SCHEMAS_BY_COLLECTION, type CollectionName } from "./schemas";
import type { ValidationIssue } from "./errors";
import { validateRegistry } from "./semantic";

export function validateRawContent(rawEntries: RawContentEntry[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  const sanitized: RawContentEntry[] = rawEntries.map((raw) => {
    const collection = raw.collection as CollectionName;
    const schema = SCHEMAS_BY_COLLECTION[collection];
    if (!schema) {
      issues.push({
        code: "unknown-collection",
        severity: "error",
        message: `Entri '${raw.id}' berasal dari koleksi tidak dikenal '${raw.collection}'.`,
      });
      return raw;
    }

    const parsed = schema.safeParse(raw.data);
    if (!parsed.success) {
      for (const problem of parsed.error.issues) {
        issues.push({
          code: "schema-invalid",
          severity: "error",
          message: `Schema '${collection}' menolak '${raw.id}' pada field '${problem.path.join(".") || "(root)"}': ${problem.message}`,
        });
      }
      return raw;
    }
    return { ...raw, data: parsed.data as Record<string, unknown> };
  });

  try {
    const registry = createRegistry(sanitized);
    issues.push(...validateRegistry(registry));
  } catch (error) {
    issues.push({
      code: "registry-error",
      severity: "error",
      message: error instanceof Error ? error.message : String(error),
    });
  }

  return issues;
}
