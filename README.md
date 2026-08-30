# Njawani

**Menyelami Jawa, Memahami Rasa**

Platform pengetahuan Jawa yang statis, terkurasi, dan saling terhubung — bahasa, sastra, dan budaya Jawa melalui empat pengalaman utama: **Jelajah**, **Kawruh**, **Sinau**, dan **Aksara**.

Dibangun static-first: Astro + TypeScript + Markdown/frontmatter, search dengan Pagefind, deploy ke GitHub Pages. Lihat `AGENTS.md` §4 untuk arsitektur yang dikunci.

## Dokumentasi

| Dokumen | Isi |
|---|---|
| `prd.md` | Product requirements & arsitektur (sumber keputusan #1) |
| `design.md` | Design system — source of truth visual |
| `AGENTS.md` | Panduan kerja untuk AI agents & kontributor |

## Perintah

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Jalankan dev server |
| `npm run build` | Build produksi ke `dist/` |
| `npm run preview` | Preview hasil build |
| `npm run check` | Type check & diagnostic Astro |

## Deploy

Target: GitHub Pages project site — `https://rafistra.github.io/njawani/`.

- `site` dan `base` sudah diatur di `astro.config.mjs` (base `/njawani/` mengikuti nama repo — lihat AGENTS.md §19).
- Workflow: `.github/workflows/deploy.yml` (build + deploy otomatis dari `main`).
- Aktivasi sekali di GitHub: **Settings → Pages → Source: GitHub Actions**.
