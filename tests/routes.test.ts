import { describe, expect, it } from "vitest";

import { createRegistry, type RawContentEntry } from "../src/lib/content/registry";
import { resolveEntryRoute, resolveRouteById, ROUTE_PREFIX } from "../src/lib/content/routes";

const registry = createRegistry([
  { collection: "topics", id: "tepa-slira", data: { type: "topic", title: "Tepa Slira", short_definition: "x" } },
  { collection: "terms", id: "krama", data: { type: "term", title: "Krama", short_definition: "x", slug: "istilah-krama" } },
  { collection: "regions", id: "banyumas", data: { type: "region", title: "Banyumas", short_definition: "x" } },
  { collection: "modules", id: "modul-1", data: { type: "module", title: "Modul 1", short_definition: "x" } },
  { collection: "sources", id: "sumber-1", data: { type: "source", title: "Sumber" } },
] as RawContentEntry[]);

describe("resolveEntryRoute", () => {
  it("memetakan tipe ke prefix route kanonik PRD §17", () => {
    const entry = registry.getEntry("tepa-slira");
    expect(resolveEntryRoute(entry!, "/")).toBe("/kawruh/tepa-slira/");

    const region = registry.getEntry("banyumas");
    expect(resolveEntryRoute(region!, "/")).toBe("/daerah/banyumas/");

    const module = registry.getEntry("modul-1");
    expect(resolveEntryRoute(module!, "/")).toBe("/sinau/modul-1/");
  });

  it("menghormati base path GitHub Pages dan slug kustom", () => {
    const entry = registry.getEntry("krama");
    expect(resolveEntryRoute(entry!, "/njawani/")).toBe("/njawani/kawruh/istilah-krama/");
  });

  it("mengembalikan null untuk tipe tanpa halaman publik", () => {
    expect(ROUTE_PREFIX.source).toBeNull();
    // Source adalah reference object terpisah — getEntry() hanya menjangkau content entry.
    expect(registry.getEntry("sumber-1")).toBeUndefined();
  });

  it("resolveRouteById memakai registry dan fallback base '/'", () => {
    expect(resolveRouteById(registry, "tepa-slira")).toBe("/kawruh/tepa-slira/");
    expect(resolveRouteById(registry, "tidak-ada")).toBeNull();
  });
});
