# PRD — Njawani

**Product Name:** Njawani  
**Tagline:** *Menyelami Jawa, Memahami Rasa*  
**Product Type:** Static knowledge platform  
**Primary Platform:** Web  
**Primary Language:** Bahasa Indonesia  
**Deployment Target:** GitHub Pages  
**Status:** Product & System Design Approved for MVP Planning  

---

## 1. Executive Summary

**Njawani** adalah platform digital statis untuk mengenal, memahami, dan menjelajahi **bahasa, sastra, serta budaya Jawa** melalui pengalaman yang menggabungkan referensi pengetahuan, eksplorasi interaktif, dan modul pembelajaran mandiri.

Njawani tidak diposisikan sebagai kamus, ensiklopedia, LMS, ataupun portal artikel biasa. Produk ini dirancang sebagai **knowledge platform yang saling terhubung**, di mana satu topik dapat membawa pengguna ke topik lain melalui relasi yang bermakna.

Pengalaman utama Njawani terdiri dari empat area:

- **Jelajah** — eksplorasi budaya secara interaktif dan tematik.
- **Kawruh** — referensi pengetahuan bahasa, sastra, budaya, tokoh, wilayah, tradisi, karya, dan konsep.
- **Sinau** — modul pembelajaran mandiri tanpa learning path wajib.
- **Aksara** — referensi dan alat terkait Aksara Jawa.

Versi awal akan dibangun dengan pendekatan **static-first** menggunakan **Astro + TypeScript + Markdown/YAML + GitHub Pages**, dengan JavaScript dan React hanya digunakan pada komponen interaktif yang benar-benar membutuhkan state atau manipulasi data.

Seluruh konten bersifat **curated-first**, disimpan sebagai Markdown dengan metadata terstruktur, divalidasi saat build, dan dihubungkan melalui knowledge relation engine.

---

# 2. Product Vision

## 2.1 Vision

Membangun ruang digital yang memungkinkan siapa pun untuk **mengenal Jawa secara luas, memahami konteks dan “rasa” di baliknya, serta menemukan hubungan antarbahasa, sastra, budaya, wilayah, tokoh, tradisi, dan karya**.

## 2.2 Positioning

Njawani bukan:

- aplikasi belajar bahasa formal,
- kamus sederhana,
- portal budaya,
- ensiklopedia artikel statis,
- atau museum digital.

Njawani diposisikan sebagai:

> **Platform pengetahuan Jawa yang dapat dicari, dipelajari, dan dijelajahi.**

## 2.3 Emotional Proposition

> **Menyelami Jawa, Memahami Rasa**

“Rasa” di sini merujuk pada konteks, hubungan sosial, filosofi, simbolisme, nuansa bahasa, dan pemaknaan budaya yang sering hilang ketika suatu konsep hanya diterjemahkan secara literal.

---

# 3. Target User

## 3.1 Primary User

**Masyarakat umum** yang ingin mengenal, memahami, atau menjelajahi bahasa, sastra, dan budaya Jawa.

Target tidak dibatasi hanya pada orang Jawa.

## 3.2 User Characteristics

Pengguna dapat:

- belum memahami Bahasa Jawa,
- memahami Bahasa Jawa tetapi tidak memahami konteks budaya,
- ingin mencari referensi cepat,
- ingin belajar topik tertentu,
- ingin memahami istilah Jawa,
- ingin menjelajahi budaya berdasarkan rasa ingin tahu,
- atau ingin melihat keterkaitan antara bahasa dan budaya.

## 3.3 User Needs

Pengguna perlu dapat:

1. mencari istilah atau topik secara cepat,
2. memahami suatu konsep dengan bahasa yang mudah,
3. melihat konteks regional dan sosial,
4. membedakan fakta, interpretasi, dan kepercayaan populer,
5. menjelajahi pengetahuan terkait,
6. belajar melalui modul mandiri,
7. memahami Aksara Jawa,
8. mengeksplorasi Jawa berdasarkan tema, wilayah, atau konteks.

---

# 4. Product Principles

Njawani mengikuti lima prinsip utama.

## 4.1 Tradition with Purpose

Tradisi digunakan sebagai **bahasa desain dan struktur pemaknaan**, bukan dekorasi.

## 4.2 Quiet Depth

Antarmuka sederhana dan tenang di permukaan, tetapi kaya ketika dijelajahi.

## 4.3 Rasa Before Information

Informasi selalu diberi konteks sebelum masuk ke detail teknis atau historis.

## 4.4 Plural Jawa

Budaya Jawa tidak diperlakukan sebagai budaya yang tunggal.

Njawani harus dapat merepresentasikan:

- Yogyakarta,
- Surakarta,
- Banyumas,
- Mataraman,
- Arek,
- Osing,
- Tengger,
- wilayah pesisir,
- serta konteks regional lain.

Bahasa Jawa standar Surakarta–Yogyakarta digunakan sebagai basis linguistik, bukan sebagai satu-satunya bentuk Bahasa Jawa yang dianggap benar.

## 4.5 Connected Knowledge

Setiap halaman harus membuka jalan ke pengetahuan lain.

> **Setiap halaman adalah pintu masuk, bukan jalan buntu.**

---

# 5. Brand

## 5.1 Product Name

**Njawani**

Nama dipilih karena memiliki nuansa “bersifat Jawa” atau “memiliki rasa Jawa”, namun produk tidak boleh digunakan sebagai alat normatif untuk menilai siapa yang “cukup Jawa”.

## 5.2 Tagline

> **Menyelami Jawa, Memahami Rasa**

## 5.3 Brand Personality

Njawani harus terasa:

- tradisional tetapi kontemporer,
- berwibawa tetapi hangat,
- berpengetahuan tetapi tidak akademis,
- eksploratif tetapi tenang,
- lokal tetapi terbuka.

---

# 6. Design Philosophy

## 6.1 Visual Direction

**Contemporary Javanese Editorial**

Njawani menggabungkan:

- publikasi budaya,
- arsip kontemporer,
- visual tradisi Jawa,
- dan pola UX produk digital modern.

## 6.2 Color System

Palette utama:

- **Gading** — background utama.
- **Sogan** — brand primary.
- **Indigo** — interaction / secondary.
- **Arang** — teks utama dan dark section.
- **Bata** — editorial accent.
- **Kuningan** — ornament/accent terbatas.

Signature palette:

> **Sogan × Indigo × Gading**

## 6.3 Typography

### Display / Editorial
**Newsreader**

Digunakan untuk:

- hero,
- heading besar,
- editorial opening,
- pull quote.

### UI / Body
**Plus Jakarta Sans**

Digunakan untuk:

- navigasi,
- body,
- metadata,
- form,
- search,
- card,
- utility.

### Aksara Jawa
**Noto Sans Javanese**

Digunakan ketika Aksara Jawa memiliki fungsi informasi, bukan sekadar dekorasi.

## 6.4 Layout Principles

- 8pt spacing system.
- 12-column desktop grid.
- generous whitespace.
- asymmetrical editorial composition diperbolehkan.
- borders lebih diprioritaskan daripada shadow.
- hindari cardification.
- konten bacaan panjang menggunakan reading width terbatas.
- full-bleed hanya untuk momen imersif tertentu.

## 6.5 Interaction Principles

- hover untuk memahami,
- klik untuk menyelami,
- scroll untuk menemukan konteks,
- relasi untuk melanjutkan perjalanan.

Animasi hanya digunakan jika membantu pemahaman atau transisi konteks.

---

# 7. Product Experience Architecture

Njawani terdiri dari empat pengalaman utama.

## 7.1 Jelajah

Tujuan:

> membantu pengguna menemukan pengetahuan melalui eksplorasi.

Bentuk pengalaman:

- guided exploration,
- eksplorasi tema,
- eksplorasi wilayah,
- eksplorasi waktu,
- peta budaya,
- curated collection,
- relation-based discovery.

## 7.2 Kawruh

Tujuan:

> memberikan canonical reference untuk pengetahuan Jawa.

Kawruh memuat:

- istilah,
- konsep,
- tradisi,
- karya,
- tokoh,
- artefak,
- seni,
- periode,
- dan objek pengetahuan lain.

## 7.3 Sinau

Tujuan:

> membantu pengguna mempelajari satu topik secara terstruktur tetapi ringan.

Untuk MVP:

- tidak ada learning path wajib,
- tidak ada level,
- tidak ada XP,
- tidak ada streak,
- tidak ada sertifikat,
- tidak ada akun/progress server-side.

Modul bersifat mandiri.

## 7.4 Aksara

Aksara menjadi top-level experience karena memiliki UX yang berbeda.

Cakupan awal:

- Carakan,
- Sandhangan,
- Pasangan,
- Aksara Murda,
- Aksara Swara,
- Aksara Rekan,
- Angka Jawa,
- transliterator Latin → Aksara Jawa.

---

# 8. Information Architecture

## 8.1 Primary Navigation

```text
Njawani
├── Beranda
├── Jelajah
├── Kawruh
├── Sinau
├── Aksara
└── Cari
```

## 8.2 Supporting Routes

- Daerah
- Cerita
- Search
- canonical knowledge pages

## 8.3 Main Content Types

Njawani membedakan:

- **Topic** — konsep umum.
- **Term** — istilah bahasa.
- **Tradition** — tradisi atau praktik budaya.
- **Region** — wilayah budaya.
- **Person** — tokoh.
- **Work** — karya.
- **Artifact / Art Form** — objek budaya atau bentuk seni.
- **Event / Period** — konteks waktu.
- **Module** — konten Sinau.
- **Article** — editorial story.
- **Exploration** — guided discovery.
- **Collection** — kurasi objek.

---

# 9. Homepage

Homepage menggunakan pendekatan **hybrid homepage**.

Tujuannya bukan menampilkan seluruh isi Njawani, tetapi membuat pengguna ingin membuka sesuatu.

## 9.1 Proposed Structure

1. Hero
2. Search
3. Tiga pintu utama: Jelajah, Kawruh, Sinau
4. Featured exploration
5. Curated topic
6. Preview peta budaya
7. Modul Sinau
8. Knowledge rabbit hole
9. Cerita editorial
10. Highlight Aksara Jawa

## 9.2 Hero

Hero memuat:

- brand Njawani,
- tagline,
- deskripsi singkat,
- search utama,
- contextual prompts.

Contoh search placeholder:

> Cari istilah, tradisi, karya sastra, atau budaya Jawa…

---

# 10. Content Strategy

## 10.1 Curated-first

Semua konten MVP disusun dan diverifikasi oleh pengelola.

Tidak ada user-generated content.

## 10.2 Editorial Formula

Setiap canonical knowledge entry idealnya memberikan:

> **Makna + Konteks + Rasa + Relasi + Sumber**

## 10.3 Editorial Tone

Konten harus:

- jelas tetapi tidak menggurui,
- berpengetahuan tetapi tidak terlalu akademis,
- hangat tetapi tidak terlalu kasual,
- menghormati tradisi tetapi tetap kritis terhadap sumber,
- menghindari generalisasi berlebihan.

## 10.4 “Catatan Rasa”

Njawani memiliki editorial primitive:

**Catatan Rasa**

Digunakan untuk menjelaskan:

- nuansa makna,
- konteks sosial,
- hal yang tidak dapat diterjemahkan secara literal,
- perbedaan pemahaman modern dan tradisional.

## 10.5 “Mitos & Konteks”

Untuk topik yang rawan bercampur antara kepercayaan dan fakta historis.

Format:

- Kepercayaan populer
- Konteks historis / antropologis
- Catatan sumber

Tidak menggunakan framing “mitos salah vs fakta benar” secara simplistik.

---

# 11. Terminology Principle

Untuk tata bahasa dan linguistik Jawa:

> **Istilah Jawa menjadi istilah utama. Bahasa Indonesia digunakan sebagai penjelasan atau padanan.**

Contoh:

**Jejer**  
*Subjek dalam struktur kalimat.*

**Wasesa**  
*Predikat.*

**Ater-ater**  
*Prefiks atau awalan.*

**Panambang**  
*Sufiks atau akhiran.*

Canonical title tetap menggunakan istilah Jawa.

Search terms dapat menggunakan padanan Bahasa Indonesia.

---

# 12. Static-first Technical Architecture

## 12.1 Core Stack

- **Astro**
- **TypeScript**
- **Markdown**
- **YAML Frontmatter**
- **GitHub Pages**
- **GitHub Actions** untuk deployment
- **React** hanya untuk interactive islands
- **Pagefind** untuk static search

## 12.2 Explicitly Not Used in MVP

- backend API,
- database runtime,
- authentication server,
- CMS backend,
- Node server runtime,
- graph database,
- dynamic SSR.

## 12.3 Core Principle

> **Build-time adalah backend Njawani.**

Validasi, relation resolution, indexing, dan route generation dilakukan sebelum deployment.

---

# 13. Repository Architecture

Njawani menggunakan **satu repository** untuk code dan content.

Proposed structure:

```text
njawani/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── knowledge/
│   │   ├── editorial/
│   │   └── interactive/
│   │
│   ├── layouts/
│   │
│   ├── pages/
│   │
│   ├── content/
│   │   ├── topics/
│   │   ├── terms/
│   │   ├── traditions/
│   │   ├── regions/
│   │   ├── persons/
│   │   ├── works/
│   │   ├── artifacts/
│   │   ├── articles/
│   │   ├── modules/
│   │   ├── explorations/
│   │   └── sources/
│   │
│   ├── lib/
│   │   ├── content/
│   │   ├── relations/
│   │   ├── search/
│   │   ├── validation/
│   │   ├── transliteration/
│   │   └── geography/
│   │
│   ├── data/
│   │   ├── taxonomies/
│   │   ├── relation-types/
│   │   └── regions/
│   │
│   └── styles/
│
├── public/
│   ├── images/
│   ├── maps/
│   └── icons/
│
├── scripts/
├── tests/
├── docs/
└── .github/
    └── workflows/
```

## 13.1 Architectural Rule

> **Komponen UI tidak boleh menjadi sumber pengetahuan.**

Data harus berasal dari content layer.

---

# 14. Markdown Architecture

## 14.1 Source of Truth

Setiap knowledge object disimpan sebagai Markdown.

Contoh:

```markdown
---
id: tepa-slira
type: topic
title: Tepa Slira

short_definition: >
  Sikap mempertimbangkan perasaan dan keadaan orang lain
  dalam hubungan sosial.

themes:
  - etika

relations:
  - type: related_to
    target: andhap-asor

sources:
  - source-001

status: published
---

## Pengantar

...

## Catatan Rasa

...
```

## 14.2 Separation of Responsibility

**Frontmatter**

menyimpan:

- metadata,
- stable ID,
- type,
- aliases,
- regions,
- relations,
- sources,
- status.

**Markdown body**

menyimpan:

- narasi,
- contoh,
- penjelasan,
- editorial content.

## 14.3 Plain Markdown Preferred

Njawani menggunakan plain Markdown sebagai default.

MDX tidak digunakan sebagai default agar konten tidak terikat langsung pada implementation frontend.

Prinsip:

> **Content describes meaning. UI decides presentation.**

---

# 15. Content Pipeline

```text
Markdown
   ↓
Astro Content Loader
   ↓
Schema Validation
   ↓
Normalize
   ↓
Global Content Registry
   ↓
Semantic Validation
   ↓
Relation Resolution
   ↓
Derived Indexes
   ↓
Static Route Generation
   ↓
Astro Build
   ↓
Pagefind Index
   ↓
GitHub Pages
```

## 15.1 Content Registry

Semua entry dinormalisasi menjadi object internal.

UI tidak membaca Markdown secara langsung.

## 15.2 Global IDs

ID harus unik di seluruh Njawani.

Contoh:

```text
tepa-slira
sekaten
banyumas
ranggawarsita
```

ID tidak bergantung pada folder atau URL.

## 15.3 Slug

Slug digunakan untuk URL publik.

ID dan slug dapat sama pada MVP tetapi tetap dianggap dua konsep berbeda.

---

# 16. Validation

Validation dibagi dua.

## 16.1 Schema Validation

Memastikan bentuk data benar.

Contoh:

- title harus string,
- sources harus array,
- status harus enum,
- regions harus sesuai bentuk schema.

## 16.2 Semantic Validation

Memastikan data masuk akal di dalam sistem.

Contoh:

- relation target harus ada,
- source ID harus valid,
- region harus ada,
- relation type harus diizinkan,
- duplicate ID tidak diperbolehkan,
- self relation tidak diperbolehkan,
- route collision tidak diperbolehkan.

Production build harus gagal jika ditemukan broken critical reference.

---

# 17. Routing Architecture

## 17.1 Public Routes

```text
/
├── /jelajah/
├── /kawruh/
├── /sinau/
├── /aksara/
├── /daerah/
├── /cerita/
└── /cari/
```

## 17.2 Canonical Knowledge Route

Mayoritas canonical knowledge objects menggunakan:

```text
/kawruh/{slug}/
```

Contoh:

```text
/kawruh/tepa-slira/
/kawruh/sekaten/
/kawruh/gunungan/
/kawruh/jejer/
```

## 17.3 Region

```text
/daerah/{slug}/
```

## 17.4 Sinau

```text
/sinau/{slug}/
```

## 17.5 Jelajah

```text
/jelajah/{slug}/
```

## 17.6 Cerita

```text
/cerita/{slug}/
```

## 17.7 Aksara

```text
/aksara/
/aksara/carakan/
/aksara/sandhangan/
/aksara/pasangan/
/aksara/transliterasi/
```

## 17.8 Search

```text
/cari/?q=...
```

## 17.9 Routing Principle

> **Content taxonomy ≠ URL taxonomy.**

Breadcrumb dan konteks berasal dari metadata, bukan path.

## 17.10 URL Resolution

Internal knowledge relation menggunakan ID.

Jangan hard-code knowledge URL jika bisa menggunakan route resolver.

---

# 18. Internal Linking

Njawani dapat mendukung wiki-style internal link:

```text
[[tepa-slira]]
```

atau:

```text
[[tepa-slira|konsep tepa slira]]
```

Build process dapat mengubahnya menjadi canonical link.

Link graph dan semantic relation graph harus dibedakan.

---

# 19. Search Architecture

## 19.1 Search Engine

**Pagefind**

Search berjalan sepenuhnya client-side pada hasil build statis.

## 19.2 Search Experience

Njawani menyediakan dua mode:

### Global Quick Search
- overlay dari navbar,
- keyboard accessible,
- beberapa hasil terbaik,
- shortcut dapat digunakan.

### Full Search
- `/cari/?q=...`,
- grouping,
- filtering,
- discovery suggestions.

## 19.3 Search Ranking Priority

Urutan ideal:

1. exact canonical title,
2. alias / Indonesian equivalent,
3. search terms,
4. short definition,
5. heading,
6. main content.

## 19.4 Search Metadata

Setiap object dapat memiliki:

- canonical title,
- aliases,
- Indonesian equivalent,
- search terms,
- short definition,
- type,
- theme,
- region.

## 19.5 Result Grouping

Hasil dapat dikelompokkan berdasarkan:

- Pengetahuan,
- Tokoh,
- Jelajah,
- Sinau,
- Cerita,
- Daerah.

## 19.6 Filters

Filter ringan:

- Jenis,
- Tema,
- Wilayah.

## 19.7 Search Principle

> **Search knows words. Knowledge architecture knows meaning.**

---

# 20. Knowledge Relation Engine

Knowledge relation engine adalah inti pengalaman connected knowledge Njawani.

## 20.1 Relation Model

```text
source
↓
relation type
↓
target
```

Contoh:

```text
Krama
→ part_of
→ Unggah-Ungguh
```

## 20.2 Typed Relations

Relation tidak boleh berupa string bebas.

Contoh relation group:

### Hierarchical
- part_of
- contains

### Contextual
- related_to
- associated_with

### Spatial
- associated_with_region
- practiced_in
- originates_from

### Temporal
- occurs_during
- emerged_during

### Language
- synonym_of
- antonym_of
- variant_of
- formal_equivalent_of

### Cultural
- used_in
- symbolizes
- derived_from

### Person / Work
- created_by
- written_by
- influenced_by

## 20.3 Inverse Relation

Editor hanya menulis satu arah.

Sistem menghasilkan inverse relation otomatis.

Contoh:

```text
Sekaten
→ uses
→ Gamelan Sekaten
```

menghasilkan:

```text
Gamelan Sekaten
← used_in
← Sekaten
```

## 20.4 Symmetric Relation

Relation tertentu seperti `related_to` dapat dianggap simetris.

## 20.5 Validation

Engine harus mendeteksi:

- broken target,
- self relation,
- duplicate relation,
- invalid type compatibility,
- invalid hierarchy cycle,
- relation ke draft dari published content.

## 20.6 Semantic Graph vs Link Graph

**Semantic graph**

berasal dari frontmatter relation.

**Link graph**

berasal dari document links.

Keduanya tidak dianggap sama.

## 20.7 Related Content

Related content diranking menggunakan:

- relation type,
- relevance,
- diversity,
- editorial priority.

## 20.8 Rabbit Hole

Rabbit hole bukan random recommendation.

Prinsip:

> **relevance + diversity + depth**

Contoh:

```text
Dhahar
↓
Krama Inggil
↓
Unggah-Ungguh
↓
Tepa Slira
↓
Etika sosial Jawa
```

---

# 21. Interactive Layer Architecture

## 21.1 Principle

> **Static by default. JavaScript only when necessary.**

## 21.2 Three Levels

### Level 1 — Static Astro

Untuk:

- article,
- knowledge body,
- relation strip,
- context rail,
- sources,
- breadcrumb,
- standard card.

### Level 2 — Astro + Native JS

Untuk:

- accordion,
- tabs sederhana,
- mobile navigation,
- copy button,
- toggle,
- lightweight interaction.

### Level 3 — React Islands

Untuk:

- Search Overlay,
- Transliterator,
- Cultural Map,
- Interactive Timeline,
- Knowledge Explorer,
- advanced filtering.

## 21.3 Hydration Strategy

Use selectively:

- `client:load` untuk search dan transliterator,
- `client:visible` untuk peta, timeline, explorer,
- `client:idle` untuk fitur sekunder,
- `client:only` sebisa mungkin dihindari.

## 21.4 Progressive Enhancement

Konten inti harus dapat diakses tanpa JavaScript.

Tanpa JS pengguna tetap dapat:

- membaca knowledge entry,
- membuka relation links,
- melihat sumber,
- membaca artikel,
- membaca modul.

Interactive feature harus memiliki fallback.

---

# 22. Cultural Map Architecture

Peta bersifat navigator, bukan database browser.

Data:

```text
GeoJSON
+
Region Registry
+
Build-time generated region metadata
```

Payload browser harus ringan.

Klik region membawa pengguna ke:

```text
/daerah/{slug}/
```

---

# 23. Transliterator Architecture

Transliteration engine harus menjadi pure TypeScript logic terpisah dari React component.

```text
UI
↓
Transliteration library
↓
Output
```

React hanya menangani:

- input,
- option,
- state,
- result,
- copy,
- error.

---

# 24. Knowledge Explorer Architecture

Untuk MVP:

- satu central node,
- maksimal sekitar 5–8 first-degree neighbours,
- grouping berdasarkan relation type,
- tidak menggunakan force-directed graph besar.

Tujuan:

> membantu discovery, bukan menjadi graph visualization demo.

---

# 25. Editorial Workflow

Proposed status:

```text
Draft
↓
Review
↓
Verified
↓
Published
↓
Needs Review
```

Production hanya mempublikasikan content yang sesuai rule.

Minimum guideline untuk canonical knowledge entry:

- short definition,
- minimum 1 source,
- minimum relasi yang cukup,
- tidak memiliki broken reference.

---

# 26. MVP Scope

Njawani v1 menggunakan pendekatan **Balanced MVP**.

## 26.1 Beranda

- Hero
- Search
- Jelajah / Kawruh / Sinau
- Featured exploration
- curated topics
- peta budaya preview
- Sinau highlight
- Aksara highlight
- knowledge rabbit hole
- cerita pilihan

## 26.2 Kawruh

- index
- canonical knowledge entry
- filter ringan
- search
- context rail
- relation strip
- related content
- sources
- regional context
- aliases

## 26.3 Jelajah

- 2–3 guided exploration
- peta budaya sederhana
- regional discovery
- thematic relation
- “Lanjut dari sini”

## 26.4 Sinau

- 4–6 modul mandiri
- tanpa progress
- tanpa account
- tanpa gamification

## 26.5 Aksara

- Carakan
- Sandhangan
- Pasangan
- Aksara Murda / Swara dasar
- Latin → Aksara Jawa initial transliterator

## 26.6 Knowledge Engine

MVP harus sudah memiliki:

- Markdown content source,
- schema validation,
- stable IDs,
- source object,
- typed relation,
- inverse relation,
- relation validation,
- static search,
- static route generation.

---

# 27. MVP Content Direction

Konten aktual akan dibahas pada tahap berikutnya.

Namun distribusi awal yang disepakati:

- **Bahasa & Unggah-Ungguh** sebagai cluster dominan.
- Aksara Jawa.
- Wayang & Seni Pertunjukan.
- Kalender, Tradisi & Kehidupan Jawa.

Bahasa & Unggah-Ungguh mencakup dua sisi:

- penggunaan praktis,
- pemahaman konseptual dan budaya.

Scope linguistik dapat berkembang mencakup:

- unggah-ungguh,
- leksikon,
- tata bahasa,
- morfologi,
- fonologi,
- ragam regional,
- kawruh basa tradisional.

Detail taxonomy konten ditunda agar fokus tetap pada sistem.

---

# 28. Explicit Out of Scope for MVP

Tidak masuk v1:

- user account,
- backend database,
- sync bookmark,
- personalized recommendation server-side,
- community contribution,
- comments,
- progress tracking,
- XP,
- streak,
- leaderboard,
- certificate,
- CMS backend,
- AI-generated canonical content,
- native mobile app,
- realtime collaboration,
- large graph visualization,
- advanced social features.

---

# 29. Non-Functional Requirements

## 29.1 Performance

- static HTML sebagai default,
- minimum JavaScript,
- lazy hydration untuk below-the-fold interactivity,
- jangan mengirim full knowledge base ke browser jika tidak perlu,
- data payload harus dibatasi per interactive component.

## 29.2 Accessibility

Minimum:

- semantic HTML,
- WCAG AA contrast target,
- keyboard navigation,
- visible focus state,
- touch target memadai,
- reduced motion support,
- interactive map memiliki non-map fallback,
- knowledge explorer tidak bergantung hanya pada warna atau posisi,
- Aksara Jawa memiliki konteks/transliterasi ketika edukatif.

## 29.3 Maintainability

- domain logic berada di `src/lib`,
- component bertugas melakukan rendering,
- stable ID tidak bergantung URL,
- generated data tidak ditulis manual jika dapat dihitung,
- satu canonical source untuk setiap knowledge object.

## 29.4 Portability

Konten harus tetap portable karena disimpan sebagai Markdown + structured metadata.

Migrasi ke CMS/database di masa depan tidak boleh memerlukan rewrite total terhadap seluruh isi konten.

---

# 30. Core Architectural Rules

Njawani mengunci prinsip berikut:

1. **Build-time adalah backend.**
2. **Markdown adalah source of truth untuk curated content.**
3. **Frontmatter menyimpan machine-readable metadata.**
4. **Markdown body menyimpan narrative content.**
5. **Stable ID tidak bergantung URL atau filename.**
6. **Content taxonomy tidak menentukan public URL.**
7. **UI tidak menjadi sumber knowledge data.**
8. **Semantic relations berbeda dengan document links.**
9. **Inverse relation dihasilkan otomatis.**
10. **Broken critical references menggagalkan production build.**
11. **HTML statis adalah default.**
12. **Native JS digunakan sebelum React jika cukup.**
13. **React hanya digunakan untuk complex interactive islands.**
14. **Konten inti tetap dapat diakses tanpa JavaScript.**
15. **Knowledge graph adalah model pengetahuan, bukan pilihan database.**
16. **Jika sesuatu dapat dihitung dari canonical data, jangan disimpan dua kali.**

---

# 31. Success Criteria for MVP

MVP dianggap berhasil apabila pengguna dapat:

1. membuka Njawani dan memahami apa produk ini,
2. mencari istilah Jawa maupun padanan Bahasa Indonesia,
3. membuka canonical knowledge entry,
4. memahami definisi dan konteksnya,
5. melihat sumber dan regional context,
6. berpindah ke knowledge object terkait,
7. masuk ke rabbit hole yang bermakna,
8. menjelajahi setidaknya beberapa tema dan wilayah,
9. mempelajari modul Sinau secara mandiri,
10. mencoba dasar Aksara Jawa dan transliterator,
11. menggunakan seluruh core content tanpa backend runtime.

Dari sisi sistem, MVP dianggap berhasil apabila:

1. seluruh knowledge content bersumber dari Markdown,
2. content schema tervalidasi,
3. duplicate ID dapat dideteksi,
4. broken relation dapat dideteksi,
5. inverse relation dihasilkan otomatis,
6. route statis dapat dihasilkan,
7. search index dapat dibuat,
8. interactive islands berjalan tanpa mengubah website menjadi SPA,
9. production build dapat dideploy ke GitHub Pages.

---

# 32. Future Considerations

Bukan bagian MVP, tetapi arsitektur harus tidak menutup kemungkinan:

- headless CMS,
- database migration,
- community contribution workflow,
- multilingual UI,
- richer language tools,
- audio pronunciation,
- bookmark,
- personal learning progress,
- AI-assisted editorial workflow,
- semantic search,
- larger knowledge visualization,
- richer regional map,
- broader cultural archives.

Canonical knowledge tidak boleh dipublikasikan otomatis oleh AI tanpa editorial review.

---

# 33. Final Product Definition

**Njawani** adalah:

> **platform pengetahuan Jawa statis, terkurasi, dan saling terhubung yang memungkinkan masyarakat umum untuk mencari, memahami, belajar, dan menjelajahi bahasa, sastra, serta budaya Jawa melalui pengalaman digital yang tenang, kontekstual, dan interaktif.**

Struktur pengalaman:

```text
              JELAJAH
             discovery
                 │
                 ▼
SINAU ───── KNOWLEDGE CORE ───── KAWRUH
learn                           reference
                 ▲
                 │
              AKSARA
            specialized
```

Fondasi teknis:

```text
Markdown
   ↓
Schema Validation
   ↓
Normalized Content Registry
   ↓
Relation Engine
   ↓
Search / Derived Indexes
   ↓
Astro Static Generation
   ↓
Interactive Islands
   ↓
Pagefind
   ↓
GitHub Pages
```

Fondasi editorial:

> **Makna + Konteks + Rasa + Relasi + Sumber**

Fondasi pengalaman:

> **Menyelami Jawa, Memahami Rasa**
