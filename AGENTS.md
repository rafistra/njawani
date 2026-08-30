# AGENTS.md — Njawani

> Panduan kerja untuk AI coding agents, autonomous agents, dan coding assistants yang mengerjakan repository **Njawani**.

---

## 1. Tujuan Dokumen

Dokumen ini adalah panduan operasional untuk agent yang:

- membaca,
- memodifikasi,
- menambah,
- menguji,
- atau mereview

kode dan konten di project **Njawani**.

Tujuan utamanya adalah memastikan agent tidak hanya menghasilkan kode yang “berjalan”, tetapi juga tetap konsisten dengan:

1. product vision,
2. arsitektur static-first,
3. knowledge architecture,
4. design system,
5. editorial principles,
6. accessibility,
7. maintainability,
8. dan batas MVP.

Dokumen ini **bukan pengganti** PRD atau design system.

Urutan sumber keputusan:

```text
1. PRD / product requirements
2. design.md
3. AGENTS.md
4. existing codebase conventions
5. implementation preference agent
```

Jika terjadi konflik, gunakan urutan di atas.

---

# 2. Ringkasan Project

**Njawani** adalah platform pengetahuan Jawa yang statis, terkurasi, dan saling terhubung.

Tagline:

> **Menyelami Jawa, Memahami Rasa**

Empat pengalaman utama:

- **Jelajah** — discovery dan eksplorasi.
- **Kawruh** — canonical knowledge/reference.
- **Sinau** — modul pembelajaran mandiri.
- **Aksara** — referensi dan tools Aksara Jawa.

Primary audience:

> masyarakat umum.

Primary UI language:

> Bahasa Indonesia.

Platform:

> responsive web.

Deployment target:

> GitHub Pages.

---

# 3. Core Product Principles

Semua perubahan harus menjaga prinsip berikut.

## 3.1 Tradition with Purpose

Elemen Jawa tidak boleh digunakan hanya sebagai dekorasi.

Jangan menambah:

- motif tradisional tanpa fungsi,
- wayang sebagai ikon universal,
- Aksara Jawa random sebagai ornament,
- visual “heritage” klise.

Tradisi harus punya:

- konteks,
- fungsi,
- makna,
- atau hubungan langsung dengan konten.

---

## 3.2 Quiet Depth

UI harus tenang.

Prioritaskan:

- whitespace,
- hierarchy,
- progressive disclosure,
- readability.

Hindari:

- dashboard density,
- terlalu banyak card,
- terlalu banyak CTA,
- visual noise,
- terlalu banyak animasi.

---

## 3.3 Rasa Before Information

Untuk content presentation:

```text
context
→ meaning
→ explanation
→ detail
→ relationship
→ source
```

Jangan membuat knowledge page terasa seperti dump metadata.

---

## 3.4 Plural Jawa

Jangan menganggap budaya Jawa homogen.

Agent harus menghindari generalisasi seperti:

> “Orang Jawa selalu...”

Jika konteksnya regional, representasikan sebagai regional.

---

## 3.5 Connected Knowledge

Knowledge object harus saling terhubung.

Jangan membuat halaman canonical yang menjadi dead-end jika relasi yang relevan tersedia.

---

# 4. Arsitektur yang Sudah Dikunci

Arsitektur utama:

```text
Markdown
   ↓
Schema Validation
   ↓
Normalized Content Registry
   ↓
Relation Engine
   ↓
Derived Indexes
   ↓
Astro Static Generation
   ↓
Interactive Islands
   ↓
Pagefind
   ↓
GitHub Pages
```

Prinsip utama:

> **Build-time adalah backend Njawani.**

Jangan mengubah model ini tanpa requirement eksplisit.

---

# 5. Technology Direction

Stack utama:

- Astro
- TypeScript
- Markdown
- YAML Frontmatter
- GitHub Pages
- Pagefind
- React hanya untuk interactive islands

MVP tidak menggunakan:

- backend API runtime,
- database runtime,
- authentication server,
- CMS backend,
- SSR server,
- graph database.

Agent **tidak boleh memperkenalkan backend** hanya untuk mempermudah implementasi.

---

# 6. Static-first Rule

Default:

> **HTML statis.**

Gunakan JavaScript hanya jika diperlukan.

Prioritas:

```text
Astro/static HTML
    ↓
native browser JavaScript
    ↓
React island
```

Jangan lompat ke React untuk komponen sederhana.

---

# 7. Kapan Menggunakan React

React boleh digunakan untuk:

- search overlay,
- transliterator,
- cultural map,
- interactive timeline,
- knowledge explorer,
- complex client-side filter.

React tidak diperlukan untuk:

- article body,
- breadcrumb,
- relation strip,
- context rail,
- cards sederhana,
- source list,
- static tabs yang bisa ditangani native JS,
- section heading.

---

# 8. Progressive Enhancement

Core content harus tetap bisa digunakan tanpa JavaScript.

Jika interactive component gagal:

- knowledge page tetap readable,
- links tetap usable,
- relation tetap tersedia,
- fallback harus tersedia.

Contoh:

Cultural Map gagal:

```text
Tampilkan daftar wilayah sebagai fallback.
```

Knowledge Explorer gagal:

```text
Tampilkan Relation Strip / related links.
```

---

# 9. Repository Philosophy

Code dan content berada dalam satu repository.

Struktur yang diharapkan:

```text
src/
├── components/
│   ├── ui/
│   ├── knowledge/
│   ├── editorial/
│   └── interactive/
│
├── layouts/
├── pages/
├── content/
├── lib/
├── data/
└── styles/

public/
scripts/
tests/
docs/
.github/
```

Ikuti struktur aktual repository jika sudah ada.

Jangan melakukan reorganisasi folder besar tanpa alasan kuat.

---

# 10. Source of Truth

## 10.1 Content

Source of truth:

> Markdown + structured frontmatter.

## 10.2 Knowledge Logic

Source of truth:

> content registry + relation engine.

## 10.3 UI

UI **tidak boleh** menjadi source of truth untuk knowledge.

Forbidden pattern:

```ts
const relatedTopics = [
  "Tepa Slira",
  "Unggah-Ungguh",
];
```

jika data tersebut sebenarnya merupakan knowledge relation.

Data semacam itu harus berasal dari content layer.

---

# 11. Content Architecture

Knowledge content menggunakan object types seperti:

- Topic
- Term
- Tradition
- Region
- Person
- Work
- Artifact / Art Form
- Event / Period
- Module
- Article
- Exploration
- Collection

Agent harus mempertahankan perbedaan semantik antar type.

Jangan mengubah semuanya menjadi generic `Article`.

---

# 12. Markdown Rule

Gunakan:

```text
Markdown body
+
YAML frontmatter
```

Markdown body:

- narasi,
- contoh,
- penjelasan,
- editorial content.

Frontmatter:

- ID,
- type,
- aliases,
- metadata,
- relations,
- regions,
- sources,
- status.

Jangan menaruh machine-readable relation hanya di prose.

---

# 13. Plain Markdown Preferred

Default:

> plain Markdown.

Jangan memperkenalkan MDX secara luas tanpa kebutuhan nyata.

Prinsip:

> **Content describes meaning. UI decides presentation.**

Hindari React components yang ditanam langsung ke banyak file content.

---

# 14. Stable IDs

Setiap canonical object memiliki stable ID.

Contoh:

```yaml
id: tepa-slira
```

ID:

- tidak bergantung filename,
- tidak bergantung folder,
- tidak bergantung URL,
- tidak boleh berubah hanya karena rename tampilan.

Relations selalu menggunakan ID.

---

# 15. Slug vs ID

ID dan slug adalah dua konsep berbeda.

MVP dapat memakai nilai sama, tetapi agent tidak boleh mengasumsikan:

```text
id === slug
```

secara permanen.

Gunakan route resolver.

---

# 16. Do Not Hard-code Knowledge URLs

Avoid:

```ts
"/kawruh/tepa-slira/"
```

jika code sebenarnya memiliki knowledge ID.

Prefer:

```text
ID
↓
route resolver
↓
canonical URL
```

Tujuan:

- slug dapat berubah,
- base path GitHub Pages aman,
- route refactor tidak merusak relation.

---

# 17. Public Routing Rules

Canonical routes:

```text
/kawruh/{slug}/
/jelajah/{slug}/
/sinau/{slug}/
/daerah/{slug}/
/cerita/{slug}/
/aksara/...
/cari/
```

Mayoritas canonical knowledge objects:

```text
/kawruh/{slug}/
```

Region:

```text
/daerah/{slug}/
```

Module:

```text
/sinau/{slug}/
```

Exploration:

```text
/jelajah/{slug}/
```

Article:

```text
/cerita/{slug}/
```

---

# 18. Content Taxonomy ≠ URL Taxonomy

Jangan membuat URL dalam nested taxonomy hanya karena content punya hierarchy.

Contoh:

hindari:

```text
/kawruh/budaya/tradisi/sekaten/
```

jika canonical pattern yang berlaku adalah:

```text
/kawruh/sekaten/
```

Breadcrumb dapat tetap:

```text
Kawruh
→ Budaya
→ Tradisi
→ Sekaten
```

berdasarkan metadata.

---

# 19. GitHub Pages Base Path

Implementation harus aman untuk:

```text
username.github.io/njawani/
```

dan custom domain di masa depan.

Jangan hard-code root absolute path tanpa memperhatikan Astro base/site config.

---

# 20. Content Registry

Komponen UI sebaiknya tidak memanggil raw collection dari banyak lokasi.

Prefer central access layer seperti:

```text
src/lib/content/
```

Contoh conceptual API:

```ts
getKnowledgeEntry(id)
getEntriesByType(type)
getEntriesByRegion(region)
```

Tujuan:

- konsistensi,
- abstraction,
- testability,
- maintainability.

---

# 21. Schema Validation

Semua collection harus tervalidasi.

Pisahkan:

## Base schema

Field umum.

## Type-specific schema

Field khusus.

Jangan membuat satu gigantic schema dengan puluhan optional fields.

---

# 22. Semantic Validation

Schema validation tidak cukup.

Agent harus mempertahankan semantic checks untuk:

- duplicate IDs,
- invalid source IDs,
- invalid region IDs,
- broken relations,
- route collisions,
- self relations,
- duplicate relations,
- incompatible relation types.

---

# 23. Relation Engine

Relation format:

```yaml
relations:
  - type: part_of
    target: unggah-ungguh
```

Setiap relation adalah:

```text
source
→ type
→ target
```

Relation type harus terkontrol.

Jangan gunakan free-form relation strings.

---

# 24. Inverse Relations

Editor hanya menulis satu arah.

System menghasilkan inverse.

Example:

```text
Sekaten
→ uses
→ Gamelan Sekaten
```

System derives:

```text
Gamelan Sekaten
← used_in
← Sekaten
```

Jangan meminta editor menulis inverse manual.

---

# 25. Symmetric vs Directional Relations

Relation registry harus mengetahui apakah relation:

- symmetric,
- directional.

Contoh symmetric:

```text
related_to
```

Contoh directional:

```text
part_of
created_by
uses
```

---

# 26. Relation Type Compatibility

Jika relation punya expected source/target type, validate.

Contoh:

```text
written_by
source: Work
target: Person
```

Jangan silently menerima invalid semantic relation.

---

# 27. Graph Integrity

Production build harus gagal untuk critical errors seperti:

- missing target,
- duplicate global ID,
- self relation,
- invalid hierarchy cycle,
- route collision.

Orphan object dapat menjadi warning, bukan selalu error.

---

# 28. Semantic Graph ≠ Link Graph

Bedakan:

## Semantic Graph

Dibuat dari typed relations.

## Link Graph

Dibuat dari document references/internal links.

Jangan otomatis mengubah semua internal link menjadi `related_to`.

---

# 29. Wiki-style Links

Jika repository menggunakan atau menambahkan wiki-style links:

```text
[[tepa-slira]]
```

dan:

```text
[[tepa-slira|konsep tepa slira]]
```

resolver harus menggunakan stable ID.

Broken wiki links harus terdeteksi saat build/check.

---

# 30. Search System

Search engine:

> Pagefind.

Jangan mengganti search dengan hosted search/backend hanya karena lebih mudah.

Search architecture:

```text
static pages
↓
Pagefind index
↓
client-side search
```

---

# 31. Search Semantics

Search relevance priority:

1. exact canonical title,
2. aliases,
3. Indonesian equivalent,
4. search terms,
5. short definition,
6. headings,
7. body.

Canonical knowledge object harus diprioritaskan dibanding artikel panjang jika query merujuk istilah utama.

---

# 32. Search Terms ≠ Aliases

Aliases:

> nama alternatif yang benar.

Search terms:

> istilah yang membantu discovery.

Example:

```yaml
title: Jejer

aliases: []

search_terms:
  - subjek
  - subject
```

Jangan memasukkan semua search keywords ke aliases.

---

# 33. Search UI

Search result harus menyajikan konteks.

Prefer:

```text
Tepa Slira
KONSEP · ETIKA

Sikap mempertimbangkan perasaan...
```

Avoid:

```text
/kawruh/tepa-slira/
...random text snippet...
```

---

# 34. Search Interaction

Support:

- quick search,
- full search,
- URL query state,
- keyboard navigation.

Full search:

```text
/cari/?q=...
```

Optional filter state:

```text
/cari/?q=wayang&daerah=banyumas
```

---

# 35. Design Source of Truth

Visual implementation harus mengikuti:

> `design.md`

Jangan membuat visual system baru di component-level.

---

# 36. Design Direction

Design direction:

> **Contemporary Javanese Editorial**

Visual signature:

- Gading,
- Sogan,
- Indigo,
- Arang,
- Newsreader,
- Plus Jakarta Sans,
- generous whitespace,
- subtle cultural reference.

---

# 37. Core Colors

Do not invent arbitrary brand colors.

Use design tokens.

Primary direction:

```text
Gading
Sogan
Indigo
Arang
Bata
Kuningan
```

Semantic states harus memakai semantic colors, bukan memaksa brand colors.

---

# 38. Typography

Display:

> Newsreader.

UI / body:

> Plus Jakarta Sans.

Javanese script:

> Noto Sans Javanese.

Do not introduce additional primary font families without strong reason.

---

# 39. Typography Behavior

Avoid:

- 800/900 weights,
- all-caps headings,
- justified long text,
- oversized SaaS headlines everywhere,
- tiny body text.

Prefer:

- editorial hierarchy,
- readable body,
- controlled line length,
- sentence case.

---

# 40. Layout Rules

Default philosophy:

> generous space.

Use:

- 8pt spacing system,
- 12-column desktop grid,
- responsive containers,
- controlled reading width.

Avoid:

- every section as cards,
- cramped spacing,
- repetitive bento layouts.

---

# 41. No Cardification

Before creating a card, ask:

> Apakah ini benar-benar discrete object?

If no:

use:

- typography,
- spacing,
- divider,
- layout.

Do not wrap every section in rounded boxes.

---

# 42. Radius

Default small radius.

Avoid:

- 20–32px card radius,
- pill-shaped everything,
- SaaS aesthetic.

---

# 43. Borders vs Shadows

Prefer:

> subtle border.

Use shadow mostly for:

- overlay,
- modal,
- popover,
- search palette.

---

# 44. Motion

Motion must:

- clarify,
- reveal context,
- support navigation.

Avoid:

- bounce,
- springy overshoot,
- decorative scroll animations,
- constant movement.

Respect:

```text
prefers-reduced-motion
```

---

# 45. Hover

Hover must add:

- context,
- affordance,
- meaning.

Not merely:

- scale,
- glow,
- arbitrary color shift.

Essential information cannot rely only on hover.

---

# 46. Accessibility

Minimum target:

> WCAG 2.2 AA.

Agent must preserve:

- semantic HTML,
- keyboard navigation,
- visible focus,
- sufficient contrast,
- touch targets,
- reduced motion,
- alt text,
- accessible dialog behavior,
- non-map fallback,
- non-graph fallback.

---

# 47. Content Accessibility

Aksara Jawa:

- provide transliteration/context where educationally needed,
- do not use script-only navigation.

Cultural images:

- meaningful alt text,
- source/caption when appropriate.

---

# 48. Interactive Island Rules

Each island owns its local state.

Do not introduce global state manager unless genuinely necessary.

Avoid:

- Redux,
- MobX,
- global context for unrelated islands.

Use URL for shareable state when appropriate.

---

# 49. Domain Logic Must Not Live in UI

Example:

Transliteration logic belongs in:

```text
src/lib/transliteration/
```

not in:

```text
Transliterator.tsx
```

Cultural region logic belongs in data/lib layer.

Relations belong in relation engine.

Components render.

Libraries understand.

> **components render; lib understands.**

---

# 50. Data Minimization

Do not send full content registry to browser.

Interactive component should receive only what it needs.

Example cultural map payload:

```text
region id
title
summary
route
count
```

not the entire knowledge content.

---

# 51. Knowledge Explorer

MVP graph view:

- one center node,
- approximately 5–8 neighbours,
- typed relation labels,
- accessible list fallback.

Do not introduce massive force-directed graph.

---

# 52. Cultural Map

Map is:

> navigator.

Map is not:

> database UI.

Cultural boundaries must be presented carefully.

Do not claim cultural polygons are absolute if source/context does not support that.

---

# 53. Transliterator

Keep transliteration engine:

- pure TypeScript where possible,
- independent from UI,
- testable,
- deterministic.

React handles interaction only.

---

# 54. Content Tone

Agent writing placeholder/sample content should follow:

- clear,
- warm,
- non-patronizing,
- culturally careful,
- non-generalizing.

Do not fabricate cultural facts.

For real content:

> source-backed editorial content is required.

---

# 55. Terminology Rule

For Javanese grammar:

> Javanese term is canonical.

Bahasa Indonesia explains it.

Example:

```text
Jejer
Subjek dalam struktur kalimat.
```

Do not rename canonical linguistic term to Indonesian equivalent for convenience.

---

# 56. Regional Language Rule

“Standard Javanese” must not be framed as:

> the only correct Javanese.

Regional variations are valid contextual information.

---

# 57. Anti-AI-Slop Rules

Never introduce generic AI design trends such as:

- glowing gradients,
- glass cards everywhere,
- huge pill CTAs,
- gradient blobs,
- random 3D objects,
- decorative sparkles,
- generic bento dashboard,
- pastel SaaS palette.

Njawani must feel:

> crafted and editorial.

---

# 58. Cultural Anti-Patterns

Avoid:

- keraton-centric imagery for all Java,
- batik everywhere,
- wayang as universal cultural icon,
- fake parchment background,
- random Javanese script decoration,
- stereotypical brown/gold heritage theme.

---

# 59. Dependency Policy

Before adding dependency:

1. inspect existing dependencies,
2. check if browser/native/Astro solution is enough,
3. justify why dependency is required,
4. prefer small and maintained libraries,
5. avoid overlapping libraries.

Do not add large dependency for one small interaction.

---

# 60. Refactor Policy

Do not perform unrelated refactors.

When changing a feature:

- follow existing patterns,
- make targeted improvement,
- avoid broad restructuring.

If architecture problem blocks task:

document it and make the minimum required structural change.

---

# 61. File Size / Responsibility

Prefer focused files.

If component/module becomes responsible for:

- fetching,
- transforming,
- business logic,
- rendering,
- state,
- styling decisions,

split responsibilities.

One unit should have one clear purpose.

---

# 62. TypeScript Rules

Prefer:

- explicit domain types,
- discriminated unions for content types,
- narrow interfaces,
- typed route/relations.

Avoid:

- `any`,
- unsafe type assertions,
- giant generic objects,
- duplicate type definitions.

---

# 63. Data Derivation

Rule:

> **If data can be derived from canonical data, do not store it twice.**

Examples:

generate:

- inverse relation,
- region index,
- related count,
- route,
- backlink list.

Do not author manually unless editorial control is required.

---

# 64. Editorial Override vs Derived Data

Separate:

## Semantic/derived relevance

system generated.

## Editorial recommendation

explicitly curated.

Do not overwrite semantic graph just to change homepage ordering.

---

# 65. Draft Content

Draft:

```yaml
status: draft
```

must not appear in production:

- routes,
- search,
- public relations,
- sitemap.

Published content must not point to draft content in production.

---

# 66. Sources

Canonical knowledge content should reference source objects.

Avoid duplicating bibliographic detail in every entry.

Prefer:

```yaml
sources:
  - kbji
  - source-001
```

Source objects are reusable.

---

# 67. Error Philosophy

Fail early during build for data integrity issues.

Prefer explicit errors like:

```text
Broken relation:
source: sekaten
target: gamelan-sekatn

Did you mean:
gamelan-sekaten
```

Avoid silent dropping of invalid canonical content.

---

# 68. Agent Workflow — Before Editing

Before making code changes:

1. inspect relevant files,
2. inspect related tests,
3. inspect current package scripts,
4. check PRD/design constraints,
5. identify existing pattern,
6. make smallest coherent plan.

Do not start by rewriting architecture.

---

# 69. Agent Workflow — During Editing

While editing:

- keep diff focused,
- preserve public behavior unless requirement changes it,
- maintain type safety,
- preserve static-first approach,
- avoid hard-coded knowledge,
- add/update validation when data model changes.

---

# 70. Agent Workflow — Before Completion

Before claiming completion:

1. run relevant checks,
2. run tests related to changed logic,
3. run type checking,
4. run content validation if content/schema changed,
5. run static build if routing/build affected,
6. inspect warnings,
7. verify no broken route/base-path assumption.

Use commands defined by the repository.

Do not invent commands without checking `package.json`.

---

# 71. Testing Priorities

Highest-priority systems to test:

1. content normalization,
2. stable ID handling,
3. relation resolution,
4. inverse relation generation,
5. semantic validation,
6. route resolver,
7. search metadata generation,
8. transliterator logic,
9. interactive accessibility behaviors.

---

# 72. Content Validation Tests

Include tests/checks for:

- duplicate ID,
- missing source,
- missing relation target,
- self relation,
- invalid relation type,
- invalid source/target compatibility,
- invalid published → draft relation,
- route collision.

---

# 73. UI Testing Priorities

Critical interactive UI:

- search dialog keyboard flow,
- Escape close behavior,
- focus restoration,
- mobile navigation,
- filters,
- transliterator input/output,
- map fallback,
- explorer fallback.

---

# 74. Performance Philosophy

Do not chase micro-optimizations prematurely.

Preserve macro rules:

- static HTML default,
- lazy hydration,
- no unnecessary JS,
- no oversized browser payload,
- no full graph payload,
- no full knowledge base payload.

---

# 75. SEO

SEO is not the primary product driver, but static pages should still have:

- meaningful `<title>`,
- description,
- semantic headings,
- canonical URLs where needed,
- usable metadata.

Do not compromise UX just for keyword stuffing.

---

# 76. Browser Behavior

Design for normal browser expectations:

- back/forward works,
- shareable search state,
- normal anchor links,
- keyboard accessibility,
- refresh-safe state where relevant.

Avoid SPA-like behavior unless necessary.

---

# 77. No Premature Backend

Do not introduce:

- Supabase,
- Firebase,
- serverless DB,
- API route,
- server middleware,

for MVP features that can remain static/client-side.

Backend is a product decision, not an implementation shortcut.

---

# 78. No Premature Authentication

There is no account system in MVP.

Do not build:

- login UI,
- auth provider,
- role system,
- user profile,
- server bookmark sync.

---

# 79. No Premature Gamification

Sinau does not require:

- XP,
- streak,
- level,
- badge,
- leaderboard,
- certificate.

Do not introduce gamification without new product requirement.

---

# 80. No Premature AI Features

Do not add:

- chatbot,
- generative summaries,
- automatic cultural explanations,
- AI recommendations,
- AI-generated canonical knowledge,

unless explicitly requested.

Canonical knowledge must remain curated.

---

# 81. No Premature Graph Database

Knowledge graph is a **data model**, not a requirement for Neo4j.

Current model:

```text
static content
+
typed relation registry
+
build-time graph indexes
```

is sufficient for MVP.

---

# 82. Change Classification

Before significant change, classify:

## Content-only
Markdown/frontmatter.

## Presentation-only
Visual/component without data model change.

## Domain change
Schema, relation, route, search metadata.

## Architecture change
Stack, deployment model, server/client boundary.

Architecture changes require explicit justification and should not be made silently.

---

# 83. Breaking Change Policy

Examples of breaking changes:

- changing stable IDs,
- changing canonical routing convention,
- changing relation semantics,
- changing content schema incompatibly,
- changing source of truth.

Before making one:

- identify migration impact,
- update validators,
- preserve aliases/redirects if appropriate,
- document migration.

---

# 84. Definition of Done — Feature

A feature is done when:

- requirement is satisfied,
- design matches design.md,
- accessibility is preserved,
- static-first principles are preserved,
- relevant tests/checks pass,
- no critical console/build errors,
- no unrelated regression is introduced,
- documentation is updated if architecture changed.

---

# 85. Definition of Done — Content Schema Change

Done when:

- schema updated,
- normalization updated,
- validation updated,
- affected content migrated,
- relation/search/routing impact checked,
- build passes.

---

# 86. Definition of Done — Interactive Island

Done when:

- static fallback exists where relevant,
- JS payload is scoped,
- accessibility works,
- keyboard behavior works,
- island state remains isolated,
- domain logic is outside UI,
- hydration strategy is appropriate.

---

# 87. Definition of Done — Knowledge Relation

Done when:

- relation type is valid,
- target exists,
- inverse behavior correct,
- semantic meaning clear,
- graph validation passes,
- UI renders relation meaningfully.

---

# 88. Documentation Policy

When architecture changes, update relevant docs.

Potential docs:

```text
PRD
design.md
AGENTS.md
architecture.md
content guide
editorial guide
```

Do not allow implementation and documentation to diverge significantly.

---

# 89. Comments

Code comments should explain:

- why,
- domain assumptions,
- non-obvious constraint.

Do not comment obvious syntax.

---

# 90. Naming

Prefer domain naming from Njawani vocabulary.

Examples:

```text
KnowledgeEntry
Relation
Region
Exploration
Module
Source
```

Avoid generic names like:

```text
DataItem
Thing
Stuff
ObjectData
```

when domain term exists.

---

# 91. UI Copy

Primary UI language:

> Bahasa Indonesia.

Javanese terms may be primary domain labels where already defined.

Example:

```text
Jejer
Subjek dalam struktur kalimat.
```

Do not randomly mix English UI labels.

---

# 92. Accessibility Copy

Error messages must be:

- clear,
- actionable,
- not cryptic.

Avoid:

```text
Error 42
Invalid state
```

Prefer:

```text
Peta interaktif tidak dapat dimuat.
Jelajahi wilayah melalui daftar berikut.
```

---

# 93. Placeholder Content

If implementation needs sample data:

- clearly mark as demo/fixture,
- do not present fabricated cultural claims as real knowledge,
- prefer neutral or already-established sample entries.

Do not invent historical facts.

---

# 94. Security Scope

Current static architecture greatly reduces runtime attack surface.

Still avoid:

- injecting unsanitized HTML,
- unsafe client rendering,
- arbitrary script execution from Markdown,
- insecure external embed behavior.

Plain Markdown is preferred partly for this reason.

---

# 95. External Links

External source links should:

- be clearly identifiable,
- not replace canonical internal knowledge links,
- use appropriate security attributes when opened in new tab.

Do not automatically open every external link in new tab.

---

# 96. Images

Images should be:

- optimized,
- meaningfully named,
- properly attributed,
- accompanied by alt text where appropriate.

Do not add huge unoptimized images directly to homepage.

---

# 97. Cultural Content Sensitivity

When implementation exposes content fields or labels, preserve distinctions such as:

- historical fact,
- interpretation,
- oral tradition,
- popular belief,
- regional variation.

Do not collapse these into one generic “fact” field.

---

# 98. Agent Review Checklist

Before final response/commit, ask:

### Architecture

- Apakah perubahan tetap static-first?
- Apakah knowledge tetap berasal dari content layer?
- Apakah saya memperkenalkan runtime/backend tanpa kebutuhan?

### Data

- Apakah ID stabil?
- Apakah relation valid?
- Apakah derived data tidak ditulis dua kali?

### UI

- Apakah desain mengikuti design.md?
- Apakah saya membuat card yang tidak perlu?
- Apakah komponen bisa menjadi static Astro?

### Accessibility

- Apakah keyboard bekerja?
- Apakah focus terlihat?
- Apakah fallback tersedia?

### Performance

- Apakah saya mengirim JS/data lebih banyak dari yang dibutuhkan?

### Product

- Apakah perubahan mendukung Jelajah/Kawruh/Sinau/Aksara?
- Apakah saya keluar dari scope MVP tanpa requirement?

---

# 99. Hard Rules

Agent **MUST NOT** melakukan hal berikut tanpa requirement eksplisit:

1. menambahkan backend runtime,
2. menambahkan database,
3. menambahkan authentication,
4. mengganti Markdown sebagai source of truth,
5. mengubah project menjadi SPA penuh,
6. memindahkan canonical knowledge ke React components,
7. hard-code relation knowledge di UI,
8. mengubah stable IDs secara massal,
9. memperkenalkan graph database,
10. memperkenalkan gamification,
11. memperkenalkan AI-generated canonical content,
12. menggunakan heavy UI framework hanya demi convenience,
13. mengabaikan accessibility fallback,
14. mengubah design direction menjadi generic SaaS,
15. menggunakan stereotype budaya sebagai shortcut visual.

---

# 100. Preferred Agent Mindset

Saat mengerjakan Njawani, optimalkan untuk:

```text
clarity
+
cultural context
+
content integrity
+
static simplicity
+
connected knowledge
+
accessible exploration
```

bukan untuk:

```text
maximum framework sophistication
maximum animation
maximum abstraction
maximum feature count
```

---

# 101. Final Guiding Principle

Jika ada beberapa cara menyelesaikan suatu kebutuhan, pilih solusi yang:

1. paling sederhana,
2. tetap static-first,
3. tidak menduplikasi knowledge,
4. mudah divalidasi saat build,
5. mudah dipahami maintainer berikutnya,
6. accessible,
7. dan tetap terasa sebagai Njawani.

> **Njawani bukan proyek untuk menunjukkan seberapa banyak teknologi yang bisa digunakan.**
>
> **Njawani adalah knowledge product yang menggunakan teknologi secukupnya agar bahasa, sastra, dan budaya Jawa dapat dipahami dan dijelajahi dengan baik.**
