# Rencana Implementasi MVP Njawani

> Roadmap implementasi penuh MVP sesuai `prd.md` §26. Setiap milestone diakhiri commit sebagai checkpoint (conventional commits). Centang setiap item saat selesai.
>
> DoD tiap milestone (AGENTS.md §84): `npm run check` + `npm test` + `npm run build` hijau, aksesibilitas & static-first terjaga.

**Konten seed (keputusan):** entri demo bertanda jelas untuk menguji pipeline + entri dasar well-established dengan sumber nyata → `published`. Konten interpretatif tetap `draft`. Tanpa fakta budaya yang dikarang.

---

## M0 — Scaffold ✅

- [x] Astro 7 + TypeScript strict + GitHub Pages config
- [x] Struktur folder PRD §13, design tokens design.md §87–88
- [x] BaseLayout + halaman placeholder, workflow deploy

## M1 — Content Engine Core (build-time backend) ✅

- [x] `src/content.config.ts` — 11 koleksi glob loader
- [x] Schema: base umum + type-specific (discriminated union) — AGENTS §21
- [x] `src/lib/content/` — registry: `getEntry(id)`, `getByType()`, `getByRegion()`; stable ID ≠ slug
- [x] `src/lib/relations/` + `src/data/relation-types/` — registry relasi terkontrol, inverse otomatis, deteksi broken/self/duplicate/cycle/published→draft — PRD §20
- [x] Route resolver ID → URL kanonik, sadar base path (`src/lib/content/routes.ts`)
- [x] Semantic validation saat build; critical error gagalkan build
- [x] Seed: entri demo bertanda + entri dasar Unggah-Ungguh (ngoko, krama, unggah-ungguh + 2 sumber nyata)
- [x] Vitest: registry / resolver / relation engine / validasi konten nyata (20 test)

Checkpoints: `feat: content collections with typed schemas` → `feat: content registry and route resolver` → `feat: relation engine with inverse generation and semantic validation` → `test: content engine unit tests`

## M2 — Kawruh (halaman pengetahuan kanonik) ✅

- [x] Template `/kawruh/{slug}/` — design.md §76 (breadcrumb, eyebrow, title, short definition, body, Context Rail, Relation Strip, Lanjut dari sini, Sources)
- [x] Komponen: TopicLink, KnowledgeCard, RelationStrip, ContextRail, CatatanRasa, MitosKonteks, Breadcrumb, SourceList (metadata via eyebrow + Context Rail)
- [x] `/kawruh/` index + filter ringan native JS
- [x] Wiki-link `[[id|teks]]` di pipeline Markdown — link graph ≠ semantic graph; wiki-link hanya menunjuk entri published
- [x] Related content ranking — PRD §20.7
- [x] Inverse relation tidak menghasilkan backlink published→draft (AGENTS §65)

Checkpoints: `feat: knowledge entry page template` → `feat: editorial knowledge components` → `feat: kawruh index with filters` → `feat: wiki-style internal links` → `feat: related content ranking`

## M3 — Search (Pagefind)

- [ ] Pagefind postbuild + metadata ranking (title > aliases > terms > short definition)
- [ ] `/cari/` full search: state URL, filter, grouping
- [ ] Quick search overlay: React island pertama — keyboard, Escape, focus restore

Checkpoints: `feat: pagefind integration and search metadata` → `feat: full search page with filters` → `feat: quick search overlay island`

## M4 — Daerah & Peta Budaya

- [ ] Region registry + `/daerah/` index + `/daerah/{slug}/` — design.md §78
- [ ] Peta SVG interaktif ringan (island `client:visible`), tanpa library map berat/tile eksternal
- [ ] Fallback daftar wilayah tanpa JS

Checkpoints: `feat: region pages` → `feat: cultural map island with list fallback`

## M5 — Jelajah

- [ ] `/jelajah/` index + template guided exploration (design.md §82) + 2–3 eksplorasi seed
- [ ] Knowledge Explorer island: 1 node pusat + 5–8 tetangga, fallback list — PRD §24

Checkpoints: `feat: jelajah index and guided explorations` → `feat: knowledge explorer island`

## M6 — Sinau

- [ ] `/sinau/` index + template modul (design.md §81) tanpa gamifikasi
- [ ] 4–6 modul seed

Checkpoint: `feat: sinau learning modules`

## M7 — Cerita

- [ ] `/cerita/` index + template editorial (design.md §83)
- [ ] 2 cerita seed terhubung ke Kawruh

Checkpoint: `feat: editorial stories`

## M8 — Aksara

- [ ] `/aksara/` hub + referensi carakan/sandhangan/pasangan/murda-swara/angka — dengan transliterasi Latin kontekstual
- [ ] Engine transliterasi pure TS (`src/lib/transliteration/`) + tests
- [ ] Transliterator island (input, opsi, output, copy) `client:load`

Checkpoints: `feat: aksara reference pages` → `feat: javanese transliteration engine` → `feat: transliterator island`

## M9 — Homepage & polish global

- [ ] Semua section PRD §9 / design.md §26–27, dark section imersif
- [ ] Mobile nav drawer, 404, meta/OG, sitemap

Checkpoints: `feat: homepage sections` → `feat: mobile navigation drawer` → `feat: 404 and page metadata`

## M10 — Hardening & rilis MVP

- [ ] CI: check + test + build sebelum deploy
- [ ] Audit a11y (design.md §89) + perf islands/hydration
- [ ] Checklist sukses MVP PRD §31; update docs

Checkpoints: `ci: run checks and tests before deploy` → `fix: accessibility and performance hardening` → `docs: architecture notes and mvp release`

---

## Di luar scope MVP

Backend runtime, database, auth, gamifikasi, AI-generated canonical content, graph database, SPA, konten komunitas — AGENTS.md §99.
