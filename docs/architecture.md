# Arsitektur Njawani

> Ringkasan arsitektur MVP. Sumber keputusan penuh: `prd.md`, `design.md`, `AGENTS.md`.

## Prinsip inti

**Build-time adalah backend Njawani.** Validasi, relasi, route, dan search index
semuanya dihitung saat build — tanpa runtime server, database, atau autentikasi.

```text
Markdown (src/content/*)
   ↓ Astro content collections + zod schema (src/content.config.ts, src/lib/validation/schemas.ts)
   ↓ Content Registry ternormalisasi (src/lib/content/registry.ts) — stable ID ≠ slug
   ↓ Validasi semantik (src/lib/validation/semantic.ts) — error kritis menggagalkan build
   ↓ Relation engine (src/lib/relations/engine.ts) — inverse otomatis dari
     registry relasi terkontrol (src/data/relation-types/relation-types.ts)
   ↓ Route resolver (src/lib/content/routes.ts) — ID → URL kanonik, sadar base path
   ↓ Astro static generation (src/pages/*)
   ↓ Interactive islands (React hanya: SearchOverlay client:idle, Transliterator client:load)
   ↓ Pagefind index (postbuild)
   → GitHub Pages
```

## Keputusan penting

- **Stable ID** berasal dari frontmatter `id` (glob loader `generateId`),
  bukan nama file. Duplicate ID global langsung gagal.
- **Semantic graph vs link graph**: relation bertipe di frontmatter ≠ wiki-link
  `[[id]]`. Wiki-link hanya menunjuk entri published.
- **Inverse relation** digenerate otomatis; backlink published→draft sengaja
  tidak dibuat (AGENTS.md §65).
- **Error UX**: referensi putus dilaporkan dengan saran "Kemungkinan maksud"
  (Levenshtein, AGENTS.md §67).
- **Peta budaya & knowledge explorer** adalah SVG statis dengan anchor native —
  tanpa JavaScript, upgrade dari rencana island awal demi static-first
  (AGENTS.md §6). Penanda skematik, bukan poligon batas budaya.
- **Search**: Pagefind diindeks postbuild (`npm run build`); filter jenis/tema
  dari metadata `data-pagefind-*` pada template entri. Non-konten dikecualikan
  lewat `data-pagefind-ignore` (prop `pagefind` di BaseLayout).
- **Konten**: hanya `status: published` yang menghasilkan route/search/relasi
  publik; entri demo bertanda `demo: true` + `status: draft`.
- **Tanggal kurasi**: field frontmatter opsional `reviewed` (ISO) menandai
  kapan entri terakhir diperiksa editorial — ditampilkan halus di Context
  Rail dengan format Indonesia lengkap ("31 Agu 2026"). Bukan timestamp
  modifikasi otomatis; tanggal modifikasi tetap menjadi ranah git.
  untuk daftar istilah terkurasi. Kelompok A–D ditandai field `section`
  (enum `COLLECTION_SECTIONS`), labelnya di `SECTION_LABELS`. Halaman induk
  `rupa-rupa-kawruh` (topic) menampilkan anaknya lewat relasi `part_of` →
  inverse `contains`; hanya anak `published` yang tampil, sehingga tautan
  ke entri berstatus review/draft tidak pernah muncul.

## Perintah

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Dev server |
| `npm run check` | Type check + diagnostic Astro |
| `npm test` | Vitest: engine, registry, relasi, validasi konten nyata |
| `npm run build` | Build + validasi + Pagefind |
| `npm run preview` | Preview hasil build (search aktif) |

## CI/CD

`.github/workflows/deploy.yml`: push ke `main` menjalankan `astro check` →
vitest (termasuk validasi konten nyata) → build → deploy ke GitHub Pages.
Build gagal jika ada referensi rusak — build-time adalah backend.
