# Design System — Njawani

**Product:** Njawani  
**Tagline:** *Menyelami Jawa, Memahami Rasa*  
**Document Type:** Product Design System & UI/UX Guidelines  
**Primary Platform:** Responsive Web  
**Primary Language:** Bahasa Indonesia  
**Design Direction:** Contemporary Javanese Editorial  
**Status:** Approved Design Foundation for MVP

---

# 1. Purpose

Dokumen ini mendefinisikan bahasa visual, prinsip UX, aturan layout, pola komponen, dan standar interaksi untuk **Njawani**.

Tujuan utama design system ini adalah memastikan seluruh pengalaman Njawani:

- terasa Jawa tanpa menjadi klise,
- modern tanpa kehilangan karakter tradisional,
- kaya informasi tetapi tetap tenang,
- eksploratif tanpa membingungkan,
- editorial tanpa menjadi seperti majalah biasa,
- dan konsisten di seluruh Beranda, Jelajah, Kawruh, Sinau, Aksara, Cari, serta halaman daerah.

Dokumen ini harus diperlakukan sebagai **source of truth desain** untuk implementasi frontend.

---

# 2. Design Vision

Njawani harus terasa seperti:

> **ruang digital untuk memasuki dunia Jawa melalui bahasa, sastra, budaya, dan rasa.**

Bukan seperti:

- LMS,
- portal berita,
- ensiklopedia akademik,
- website museum yang kaku,
- atau UI modern yang hanya ditempeli motif tradisional.

Arah visual:

> **Contemporary Javanese Editorial**

Karakter utama:

- tenang,
- hangat,
- editorial,
- bertekstur,
- berwibawa,
- manusiawi,
- eksploratif,
- kontekstual.

---

# 3. Core Design Principles

## 3.1 Tradition with Purpose

Tradisi digunakan sebagai **bahasa desain**, bukan tempelan dekoratif.

Gunakan elemen tradisional jika membantu:

- hierarchy,
- framing,
- ritme,
- orientasi,
- konteks,
- atau identitas.

Hindari penggunaan motif Jawa hanya karena terlihat “lokal”.

### Do

- motif digunakan sebagai divider tipis,
- aksara Jawa sebagai secondary information layer,
- ritme layout terinspirasi struktur visual tradisional,
- warna mengambil inspirasi material budaya Jawa.

### Don’t

- batik sebagai background utama seluruh website,
- wayang sebagai ikon universal untuk semua kategori,
- ornamen sudut pada setiap card,
- font dekoratif sulit dibaca,
- efek “kertas tua” berlebihan.

---

## 3.2 Quiet Depth

Njawani harus sederhana di permukaan tetapi kaya ketika dijelajahi.

Gunakan:

- whitespace besar,
- informasi bertahap,
- progressive disclosure,
- hierarchy yang kuat,
- layout dengan ritme.

Hindari:

- dashboard density,
- terlalu banyak CTA,
- terlalu banyak card,
- terlalu banyak warna,
- section yang semuanya sama berat.

---

## 3.3 Rasa Before Information

Konten budaya tidak boleh langsung terasa seperti database.

Urutan yang dianjurkan:

1. konteks,
2. makna,
3. penjelasan,
4. detail,
5. hubungan,
6. sumber.

Contoh:

```text
Satu Suro
Awal tahun dalam penanggalan Jawa.

[visual/konteks]

Pengertian
Makna
Tradisi
Variasi regional
Mitos & Konteks
Topik terkait
Sumber
```

---

## 3.4 Plural Jawa

Njawani tidak boleh merepresentasikan Jawa sebagai budaya tunggal.

Design system harus menyediakan ruang untuk:

- variasi regional,
- perbedaan praktik,
- variasi istilah,
- variasi bahasa,
- konteks waktu.

Metadata wilayah harus mudah dikenali tetapi tidak mendominasi konten.

---

## 3.5 Connected Knowledge

Setiap halaman harus memberi jalan untuk melanjutkan eksplorasi.

Komponen seperti:

- Relation Strip,
- Topic Link,
- Context Rail,
- “Lanjut dari sini”,
- Regional Context,
- Guided Exploration,

adalah bagian inti pengalaman.

> **Setiap halaman adalah pintu masuk ke pengetahuan lain.**

---

# 4. Brand Expression

## 4.1 Product Name

**Njawani**

## 4.2 Tagline

**Menyelami Jawa, Memahami Rasa**

## 4.3 Brand Personality

Njawani harus berada pada spektrum:

| Axis | Position |
|---|---|
| Tradisional ↔ Modern | Tradisional yang dikemas modern |
| Formal ↔ Kasual | Hangat tetapi berwibawa |
| Akademis ↔ Populer | Berpengetahuan tetapi mudah dipahami |
| Dekoratif ↔ Minimal | Minimal dengan aksen tradisional |
| Eksklusif ↔ Terbuka | Terbuka untuk masyarakat umum |
| Statis ↔ Eksploratif | Eksploratif tetapi tenang |

---

# 5. Color System

## 5.1 Color Philosophy

Njawani menggunakan palette yang terinspirasi material dan budaya Jawa:

- gading,
- sogan,
- indigo,
- arang,
- bata,
- kuningan.

Signature palette:

> **Sogan × Indigo × Gading**

Warna harus digunakan secara restrained.

---

## 5.2 Core Palette

### Gading

Primary canvas/background.

```css
--color-gading-50:  #FCFAF6;
--color-gading-100: #F5F0E6;
--color-gading-200: #E9E0D1;
--color-gading-300: #DCCFBC;
```

Recommended default:

```css
--color-canvas: #F5F0E6;
```

---

### Sogan

Primary brand color.

```css
--color-sogan-100: #E7D4C8;
--color-sogan-300: #C8A891;
--color-sogan-500: #8A5B45;
--color-sogan-600: #744936;
--color-sogan-700: #5D3B2F;
--color-sogan-800: #493128;
```

Recommended:

```css
--color-brand: #744936;
--color-brand-dark: #493128;
--color-brand-soft: #C8A891;
```

---

### Indigo

Secondary interaction color.

```css
--color-indigo-100: #D9E1E7;
--color-indigo-300: #8397A6;
--color-indigo-500: #4E6577;
--color-indigo-600: #344A5E;
--color-indigo-700: #273A4A;
```

Recommended:

```css
--color-interactive: #344A5E;
```

---

### Arang

Primary text and dark surface.

```css
--color-arang-100: #D8D4CE;
--color-arang-300: #918B83;
--color-arang-500: #4D4842;
--color-arang-700: #26231F;
--color-arang-800: #1D1B18;
```

Recommended:

```css
--color-text: #26231F;
--color-surface-dark: #26231F;
```

---

### Bata

Editorial accent.

```css
--color-bata-100: #E8C4BB;
--color-bata-300: #C88170;
--color-bata-500: #A24E3F;
--color-bata-700: #773629;
```

Use sparingly.

---

### Kuningan

Decorative/heritage accent.

```css
--color-kuningan-100: #E9DFC8;
--color-kuningan-300: #CDBA8B;
--color-kuningan-500: #B19461;
--color-kuningan-700: #816B44;
```

Never use as fake “gold gradient”.

---

# 6. Semantic Colors

Brand colors must not replace semantic colors.

Use separate functional tokens:

```css
--color-success: #3F6B4F;
--color-warning: #A26A2D;
--color-error:   #9B3F38;
--color-info:    #3C6178;
```

Always combine status color with:

- label,
- icon,
- or supporting text.

Never depend on color alone.

---

# 7. Color Usage Ratio

Approximate composition:

```text
65% neutral Gading / Linen
20% Arang / typography / dark section
8%  Sogan
4%  Indigo
2%  Bata
1%  Kuningan
```

This is guidance, not a hard numerical requirement.

Goal:

> interface tetap dominantly calm and neutral.

---

# 8. Surface System

Recommended tokens:

```css
--surface-canvas: #F5F0E6;
--surface-soft: #E9E0D1;
--surface-elevated: #FCFAF6;
--surface-dark: #26231F;
--surface-dark-soft: #312D28;
```

Avoid excessive elevated surfaces.

Prefer:

- whitespace,
- border,
- hierarchy,

instead of stacked cards.

---

# 9. Border System

Use warm-neutral borders.

```css
--border-subtle: rgba(38, 35, 31, 0.14);
--border-default: rgba(38, 35, 31, 0.24);
--border-strong: rgba(38, 35, 31, 0.42);
```

Default border:

```text
1px solid subtle/default
```

Prefer borders over shadows.

---

# 10. Shadow System

Shadows are minimal.

Allowed use:

- overlay,
- command/search palette,
- modal,
- floating popover.

Avoid shadows on every card.

Recommended conceptual levels:

```text
shadow-sm  — subtle separation
shadow-md  — overlay/popover
shadow-lg  — modal only
```

No dramatic soft-glow shadows.

---

# 11. Border Radius

Njawani should not feel like a rounded SaaS app.

Recommended:

```css
--radius-xs: 2px;
--radius-sm: 4px;
--radius-md: 6px;
--radius-lg: 8px;
--radius-full: 999px;
```

Use:

- `4px` default,
- `6–8px` for larger panels,
- `999px` only for tags/chips when appropriate.

Avoid huge radius like 20–32px for standard cards.

---

# 12. Typography System

## 12.1 Font Stack

### Display / Editorial

**Newsreader**

Fallback:

```css
font-family: "Newsreader", Georgia, serif;
```

### UI / Body

**Plus Jakarta Sans**

Fallback:

```css
font-family: "Plus Jakarta Sans", system-ui, sans-serif;
```

### Javanese Script

**Noto Sans Javanese**

Use only when Aksara Jawa carries information.

---

# 13. Typography Philosophy

Njawani uses contrast between:

> **editorial expression** and **functional clarity**

Newsreader provides:

- character,
- literary tone,
- depth,
- emotion.

Plus Jakarta Sans provides:

- readability,
- UI clarity,
- usability,
- consistency.

Aksara Jawa provides:

- identity,
- information,
- cultural context.

---

# 14. Type Scale

## Display

### Display XL

```text
Desktop: 80px / 0.98
Tablet:  64px / 1.00
Mobile:  46px / 1.02
```

Weight:

```text
400–500
```

Use for hero only.

---

### Display L

```text
Desktop: 64px / 1.00
Mobile:  40px / 1.06
```

---

### H1

```text
Desktop: 48px / 1.08
Mobile:  36px / 1.10
```

---

### H2

```text
Desktop: 36px / 1.12
Mobile:  30px / 1.15
```

---

### H3

```text
Desktop: 28px / 1.20
Mobile:  24px / 1.25
```

---

### H4

```text
20–22px / 1.30
```

---

# 15. Body Typography

### Intro / Lead

```text
20–22px / 1.55
```

Newsreader or Plus Jakarta Sans depending context.

---

### Body Large

```text
18px / 30px
```

---

### Body

```text
16px / 26px
```

---

### Body Small

```text
14px / 22px
```

---

### Label

```text
12–13px
uppercase optional
letter-spacing: 0.08em–0.12em
```

Use all-caps only for small labels.

---

# 16. Typography Rules

## Use

- sentence case for headings,
- title case only when linguistically appropriate,
- serif for hero/editorial emphasis,
- sans for UI and long-form body.

## Avoid

- bold weight 800–900,
- all-caps headings,
- excessive letter spacing,
- justified text,
- center alignment for long paragraphs.

Hierarchy should come from:

- size,
- spacing,
- layout,
- contrast,

not excessive bolding.

---

# 17. Reading Width

Recommended:

```text
Article body: 680–760px
```

Target:

```text
~60–75 characters per line
```

Knowledge page desktop:

```text
Main content: 700–760px
Context rail: 280–320px
```

---

# 18. Aksara Jawa Usage

Aksara Jawa is a **secondary information layer**, not decorative filler.

Use for:

- title transliteration,
- educational content,
- character references,
- visual identity accents tied to actual meaning.

Example:

```text
Jawa
ꦗꦮ
```

Avoid:

- navigation fully in Aksara Jawa,
- random background script,
- unreadable decorative usage.

---

# 19. Spacing System

Use an 8pt-based system.

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 24px;
--space-6: 32px;
--space-7: 48px;
--space-8: 64px;
--space-9: 96px;
--space-10: 128px;
```

---

# 20. Spacing Philosophy

Use more vertical space than typical SaaS apps.

Recommended desktop section gap:

```text
64–96px
```

Immersive section:

```text
96–128px
```

Mobile:

```text
48–64px
```

Rule:

> **Ruang kosong adalah bagian dari konten.**

---

# 21. Container System

## Wide

```text
1200–1280px
```

Use for:

- homepage,
- map,
- gallery,
- exploration.

## Content

```text
960–1080px
```

Use for:

- landing,
- module,
- knowledge layout.

## Reading

```text
680–760px
```

Use for:

- article,
- editorial story,
- long-form explanation.

---

# 22. Grid System

Desktop:

```text
12 columns
24–32px gutter
```

Recommended patterns:

```text
Hero:
5 columns content
7 columns visual
```

```text
Knowledge page:
8 columns main
4 columns context
```

```text
Editorial:
centered reading width
```

---

# 23. Responsive Breakpoints

Suggested:

```css
--bp-sm: 640px;
--bp-md: 768px;
--bp-lg: 1024px;
--bp-xl: 1280px;
```

These can be adjusted during implementation.

---

# 24. Responsive Philosophy

Desktop is:

- layered,
- asymmetrical,
- contextual,
- spatial.

Mobile is:

- linear,
- focused,
- narrative,
- touch-first.

Never merely shrink desktop layout.

---

# 25. Asymmetry

Asymmetrical editorial layouts are encouraged.

Example:

```text
[Large title]

               [Javanese script]

[Body copy]

                         [visual]
```

Rule:

> **Asymmetrical ≠ random.**

All asymmetry must still align to the grid.

---

# 26. Homepage Rhythm

Recommended rhythm:

```text
Calm
↓
Structured
↓
Immersive
↓
Informative
↓
Immersive
↓
Light
↓
Explorative
↓
Calm
```

Avoid repeating identical card-grid sections.

---

# 27. Homepage Structure

Recommended:

```text
Navigation
↓
Hero + Search
↓
Jelajah / Kawruh / Sinau gateway
↓
Featured Exploration
↓
Curated Knowledge
↓
Cultural Map Preview
↓
Sinau Modules
↓
Knowledge Rabbit Hole
↓
Editorial Story
↓
Aksara Highlight
↓
Footer
```

---

# 28. Navigation

## Desktop

Concept:

```text
NJAWANI

Jelajah    Kawruh    Sinau    Aksara

                                Cari
```

Behavior:

- minimal,
- no mega-menu for MVP,
- subtle Indigo hover/underline,
- active section visually clear.

---

## Mobile

Concept:

```text
NJAWANI                     Cari  Menu
```

Drawer:

- Jelajah
- Kawruh
- Sinau
- Aksara
- Cerita
- Tentang if needed

Avoid bottom navigation for MVP.

---

# 29. Buttons

Use three levels.

## Primary

- Sogan background,
- Gading text,
- small radius,
- medium weight.

Use only for high-intent actions.

## Secondary

- transparent,
- border,
- Arang/Sogan text.

## Text Action

Preferred for exploration.

Example:

```text
Jelajahi topik →
```

Avoid oversized pill buttons.

---

# 30. Link Style

Inline links:

- Indigo,
- subtle underline or underline-on-hover,
- clearly distinguishable from body text.

Topic links can include:

```text
Gunungan ↗
Wayang · Simbolisme
```

Hover may expose context.

---

# 31. Search Component

Search is a primary product component.

Placeholder:

> Cari istilah, tradisi, karya sastra, atau budaya Jawa…

Search should feel:

- large,
- calm,
- knowledge-oriented,
- not like an admin filter.

---

# 32. Search Overlay

Desktop:

- modal/command palette style,
- keyboard navigable,
- focused search input,
- grouped results,
- escape closes.

Suggested result groups:

- Pengetahuan
- Tokoh
- Jelajah
- Sinau
- Daerah
- Cerita

---

# 33. Topic Link Component

Signature component.

Example:

```text
Gunungan
Wayang · Simbolisme
```

Optional hover:

```text
Gunungan
Simbol penting dalam pertunjukan wayang...
```

Purpose:

> help users decide where to go next.

---

# 34. Knowledge Card

Use when a knowledge object must stand independently.

Structure:

```text
CATEGORY / CONTEXT

Title

Short definition

Metadata

Jelajahi →
```

Style:

- subtle border,
- minimal background,
- no heavy shadow.

---

# 35. Exploration Card

More visual than Knowledge Card.

Structure:

```text
Image / Illustration

Title

Short editorial description

Explore →
```

Can use:

- asymmetrical layout,
- image-forward composition,
- larger typography.

---

# 36. Module Card

Sinau card should be simple.

Example:

```text
Ngoko dan Krama

Dasar unggah-ungguh dalam percakapan sehari-hari.

10 menit
```

No:

- XP,
- level,
- progress bar,
- badge spam.

---

# 37. Metadata & Tags

Use sparingly.

Examples:

```text
BUDAYA
YOGYAKARTA
SASTRA
RAGAM BAHASA
```

Tags:

- mostly neutral,
- subtle border,
- not color-coded by category.

Avoid rainbow category systems.

---

# 38. Breadcrumb

Desktop:

```text
Kawruh / Budaya / Tradisi / Sekaten
```

Mobile:

```text
← Tradisi
```

Breadcrumb derives from taxonomy, not route depth.

---

# 39. Context Rail

Use on desktop knowledge pages.

Example:

```text
KONTEKS

Jenis
Tradisi

Wilayah
Yogyakarta
Surakarta

Berkaitan
Sekaten
Grebeg
```

Purpose:

- orient,
- contextualize,
- connect.

On mobile:

- move inline,
- do not create sticky narrow sidebar.

---

# 40. Relation Strip

Signature component.

Example:

```text
Berkaitan dengan

Gunungan
Grebeg
Sekaten
Keraton
```

If relations have types, group them.

Example:

```text
Digunakan dalam
Wayang Kulit

Berkaitan dengan
Dalang
Suluk
```

---

# 41. “Lanjut dari sini”

Mandatory pattern for major content pages.

Example:

```text
Lanjut dari sini

Mengenal Gunungan
Apa itu Suluk?
Tokoh Punakawan
Gamelan dalam Wayang
```

Purpose:

> avoid dead-end pages.

---

# 42. Regional Context

Component for regional variation.

Example:

```text
Ragam regional

Banyumas
Penggunaan istilah...

Surakarta
Bentuk yang lebih umum...

Jawa Timur
Pelafalan / penggunaan...
```

Do not frame regional forms as “wrong”.

---

# 43. Catatan Rasa

Signature editorial component.

Purpose:

- nuance,
- cultural context,
- social meaning,
- translation caveat.

Visual treatment:

- subtle Sogan border/accent,
- soft Linen background,
- no warning icon unless needed.

Example:

```text
Catatan Rasa

Andhap asor tidak berarti merendahkan harga diri...
```

---

# 44. Mitos & Konteks

Use when popular belief and historical/anthropological context differ.

Structure:

```text
Kepercayaan populer
...

Konteks yang perlu diketahui
...
```

Avoid adversarial “MYTH / FACT” treatment.

---

# 45. Quote Component

Use for:

- literary excerpts,
- curated quotation,
- interpretive statement.

Style:

- Newsreader,
- generous whitespace,
- optional thin vertical rule.

Do not overuse.

---

# 46. Image Treatment

Images should feel documentary/editorial.

Use:

- full captions,
- source,
- location/date where relevant,
- proper aspect ratio,
- respectful cropping.

Recommended ratios:

```text
Hero: 16:9 or 3:2
Editorial portrait: 4:5
Exploration card: 3:2
Artifact: 1:1 or natural ratio
```

Do not crop important cultural objects aggressively.

---

# 47. Image Caption

Recommended:

```text
[Image]

Gunungan dalam pertunjukan wayang kulit.
Yogyakarta, tahun/sumber jika tersedia.
Sumber: ...
```

Captions must be visually secondary but readable.

---

# 48. Texture & Ornament

Allowed:

- faint grain,
- subtle paper texture,
- low-opacity geometric motif,
- thin decorative lines,
- abstract references to traditional patterns.

Rule:

> Jika motif langsung menjadi hal pertama yang diperhatikan, motif terlalu kuat.

---

# 49. Dark Sections

Njawani is not a dark-themed brand by default.

Dark sections may be used as immersive breaks.

Example:

```text
Arang background
Gading text
```

Use for:

- featured exploration,
- wayang section,
- cultural immersion,
- hero interlude.

Avoid overuse.

---

# 50. Iconography

Recommended:

- simple line icons,
- restrained geometry,
- consistent stroke,
- no filled cartoon icons.

Icons should support understanding.

Avoid:

- random wayang icons for generic actions,
- excessively ethnicized icon sets,
- icons when text is clearer.

---

# 51. Motion Principles

Motion must be:

- subtle,
- slow,
- purposeful,
- content-supporting.

Recommended:

```text
Micro interaction: 150–220ms
Section transition: 250–400ms
Immersive reveal: 400–600ms
```

Preferred easing:

- ease-out,
- smooth cubic-bezier,
- no bounce.

Avoid:

- overshoot,
- springy UI,
- dramatic parallax,
- decorative animation loops.

---

# 52. Motion Hierarchy

Use motion to:

- clarify opening/closing,
- reveal relation/context,
- transition between knowledge states,
- gently emphasize.

Do not use motion just because an element enters viewport.

---

# 53. Hover Principles

Hover should provide:

- meaning,
- preview,
- affordance.

Not just animation.

Example:

```text
Gunungan
↓ hover
Wayang · Simbolisme
Simbol pembuka dan penutup...
```

---

# 54. Focus States

Keyboard focus must be obvious.

Recommended:

```text
2px outline Indigo
2–3px offset
```

Never remove focus outline without replacement.

---

# 55. Progressive Disclosure

Hide only secondary information.

Do not hide core meaning behind:

- accordions,
- tabs,
- hover,
- tooltips.

Use disclosure for:

- additional regional notes,
- source details,
- expanded examples,
- secondary metadata.

---

# 56. Search Interaction Pattern

Search state should be reflected in URL on full search page.

Example:

```text
/cari/?q=wayang
```

Optional filters:

```text
/cari/?q=wayang&daerah=banyumas
```

Quick search and full search should use the same visual language.

---

# 57. Guided Exploration Pattern

Example:

```text
Mengenal Dunia Wayang

01 Apa itu Wayang?
02 Dalang
03 Gunungan
04 Punakawan
05 Gamelan
06 Ragam Wayang
```

Allow:

- sequential reading,
- skipping,
- jumping to Kawruh.

Do not force linear completion.

---

# 58. Knowledge Explorer

For MVP:

- central node,
- 5–8 nearest nodes,
- clear relation label,
- accessible list fallback.

Avoid:

- giant force graph,
- hundreds of nodes,
- graph as primary navigation.

---

# 59. Cultural Map

Map must:

- be a discovery tool,
- expose region context,
- link to region pages,
- have a non-map fallback.

Hover:

- region name,
- short summary.

Click:

- region detail / related knowledge.

Do not treat cultural boundaries as absolute administrative borders.

---

# 60. Timeline

Use for:

- literature,
- periods,
- historical development,
- cultural sequence.

Design:

- readable without drag,
- supports keyboard,
- contextual labels,
- no overly dense micro-dates.

---

# 61. Transliterator UI

Structure:

```text
Latin input
↓
Options if needed
↓
Aksara output
↓
Copy
```

Design should prioritize:

- readability,
- input confidence,
- error clarity,
- educational context.

Avoid visual gimmicks.

---

# 62. Forms

Forms are minimal in MVP.

If present:

- large readable labels,
- always-visible labels,
- helper text when necessary,
- clear error messages,
- no placeholder-only labels.

---

# 63. Empty States

Tone:

- calm,
- informative,
- not overly playful.

Example:

```text
Belum ada topik yang cocok.

Coba istilah lain atau mulai dari Jelajah.
```

---

# 64. Loading States

Avoid generic spinner-only screens.

Prefer:

- skeleton maintaining layout,
- static preview,
- lightweight placeholder.

For lazy islands:

```text
Jelajahi Jawa berdasarkan wilayah
[map placeholder]
```

Then hydrate.

---

# 65. Error States

Error should not break the full content experience.

Example:

```text
Peta interaktif tidak dapat dimuat.

Jelajahi wilayah melalui daftar berikut:
Banyumas
Yogyakarta
Surakarta
...
```

Always offer fallback where possible.

---

# 66. Accessibility Principles

Target minimum:

**WCAG 2.2 AA**

Required:

- semantic HTML,
- keyboard navigation,
- visible focus,
- sufficient contrast,
- touch target ≥ 44×44px where applicable,
- reduced-motion support,
- captions/alt text,
- no color-only meaning,
- map alternatives,
- graph alternatives,
- accessible dialogs/search.

---

# 67. Reduced Motion

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

Disable/reduce:

- parallax,
- animated reveal,
- smooth transform-heavy transitions.

Keep:

- essential state changes.

---

# 68. Content Accessibility

For Aksara Jawa:

- provide Latin transliteration where educationally relevant,
- do not use script-only navigation,
- ensure appropriate text alternatives.

For cultural images:

- alt text should describe what is visually meaningful,
- avoid merely repeating caption.

---

# 69. Mobile Design Rules

Mobile:

- one-column default,
- shorter heading line length,
- reduced section spacing,
- inline context rail,
- sticky elements used sparingly,
- no hover-dependent information,
- filter panels become drawer/sheet if needed.

---

# 70. Tablet Design Rules

Tablet may retain:

- partial asymmetry,
- 2-column layout,
- larger visuals.

But avoid squeezing desktop context rail.

---

# 71. Touch Interaction

Any interaction requiring hover must have:

- tap equivalent,
- visible label,
- or accessible alternative.

Never hide essential context exclusively behind hover.

---

# 72. Cardification Rules

Use a card only if:

- item is a discrete object,
- item is selectable,
- item needs clear grouping.

Do not card:

- every paragraph,
- every metadata item,
- section heading,
- basic related links.

Preferred alternative:

- spacing,
- divider,
- typographic hierarchy.

---

# 73. Anti-AI-Slop Principles

Njawani must avoid generic “AI-generated design” patterns.

Do not use:

- excessive gradient blobs,
- glowing borders,
- glassmorphism everywhere,
- huge rounded cards,
- random pastel color palettes,
- generic 3D floating objects,
- excessive bento-grid repetition,
- meaningless icon badges,
- decorative sparkles,
- “AI SaaS” hero composition,
- superfluous animated counters.

Njawani should feel:

> **crafted, editorial, culturally grounded, restrained.**

---

# 74. Cultural Anti-Pattern Rules

Avoid:

- representing all of Jawa through keraton imagery,
- using batik as universal texture,
- treating wayang as logo for every cultural topic,
- equating “traditional” with “old parchment”,
- stereotyping Java as brown-gold only,
- decorative Aksara Jawa without semantic value.

---

# 75. Component Density

Keep interface density low to medium.

Rule of thumb:

- one primary intent per section,
- one primary CTA,
- limited metadata,
- clear content hierarchy.

---

# 76. Page Template — Knowledge Entry

Recommended:

```text
Breadcrumb

Eyebrow / Type / Region

Title
Aksara Jawa if relevant
Short definition

Hero / Contextual visual

Main content
├── Pengertian
├── Konteks
├── Contoh
├── Catatan Rasa
├── Regional Context
└── Mitos & Konteks if relevant

Context Rail

Relation Strip

Lanjut dari sini

Sources
```

---

# 77. Page Template — Tradition

Recommended:

```text
Title
Short definition
Region / Time

Overview
Latar belakang
Rangkaian praktik
Objek/simbol
Makna
Variasi regional
Perubahan masa kini
Mitos & Konteks
Gallery
Related knowledge
Sources
```

---

# 78. Page Template — Region

Recommended:

```text
Region name
Short cultural summary
Map context

Language
Traditions
Arts
Literature
Daily life
Food
Architecture
People / Works
Related regions
Cultural boundary note
Sources
```

---

# 79. Page Template — Person

Recommended:

```text
Name
Period / Region / Role

Summary
Life
Historical context
Works
Ideas/contribution
Influence
Timeline
Related topics
Sources
```

---

# 80. Page Template — Work

Recommended:

```text
Title
Author
Period
Language / Script

Summary
Creation context
Structure
Themes
Selected passages
Original text
Transliteration
Translation
Interpretation
Important terms
Related works
Sources
```

---

# 81. Page Template — Sinau Module

Recommended:

```text
Title
Short description
Estimated reading time

What you will understand

Introduction

Concept 1
Example

Concept 2
Example

Catatan Rasa

Short exercise

Summary

Pelajari selanjutnya
```

No gamification.

---

# 82. Page Template — Exploration

Recommended:

```text
Immersive intro

Step 01
Context

Step 02
Context

Step 03
Context

Visual / Map / Timeline

Related Kawruh

Continue exploring
```

---

# 83. Page Template — Editorial Story

Recommended:

```text
Eyebrow

Headline
Dek / subheadline

Hero image

Lead paragraph

Article content

Pull quote if needed

Contextual links

Related Kawruh

Sources / Reading
```

---

# 84. Homepage Section Pattern — Gateway

Three primary areas:

```text
Jelajah
Temukan hubungan dan cerita.

Kawruh
Cari dan pahami pengetahuan.

Sinau
Pelajari satu topik pada satu waktu.
```

Avoid gamified icons.

---

# 85. Homepage Section Pattern — Featured Exploration

Large editorial composition:

```text
[visual]

Jelajahi Dunia Wayang

Tokoh, simbol, cerita, dan pertunjukan.

Mulai jelajah →
```

Can use dark section.

---

# 86. Homepage Section Pattern — Knowledge Rabbit Hole

Example:

```text
Mulai dari satu topik

Unggah-Ungguh

→ Ngoko
→ Krama
→ Tepa Slira
→ Andhap Asor
```

Visual branching must stay simple.

---

# 87. Design Tokens — Suggested CSS Foundation

```css
:root {
  --font-display: "Newsreader", Georgia, serif;
  --font-ui: "Plus Jakarta Sans", system-ui, sans-serif;
  --font-javanese: "Noto Sans Javanese", sans-serif;

  --color-canvas: #F5F0E6;
  --color-surface: #FCFAF6;
  --color-surface-soft: #E9E0D1;
  --color-text: #26231F;
  --color-text-muted: #6A645D;

  --color-brand: #744936;
  --color-brand-dark: #493128;
  --color-brand-soft: #C8A891;

  --color-interactive: #344A5E;
  --color-accent: #A24E3F;
  --color-heritage: #B19461;

  --border-subtle: rgba(38, 35, 31, 0.14);
  --border-default: rgba(38, 35, 31, 0.24);

  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
  --space-9: 96px;
  --space-10: 128px;

  --container-wide: 1280px;
  --container-content: 1040px;
  --container-reading: 720px;
}
```

---

# 88. Interaction Tokens

Suggested:

```css
--duration-fast: 160ms;
--duration-default: 240ms;
--duration-slow: 420ms;

--ease-standard: cubic-bezier(.2, .8, .2, 1);
```

---

# 89. Design QA Checklist

Before a page/component is considered ready:

## Brand
- Does it feel like Njawani?
- Is the cultural reference meaningful?
- Is the page free from decorative cliché?

## Layout
- Is there enough whitespace?
- Is the hierarchy obvious?
- Is the layout responsive without simply shrinking desktop?

## Typography
- Is Newsreader used for editorial hierarchy only?
- Is body text easy to read?
- Are line lengths controlled?
- Are all-caps used sparingly?

## Color
- Is Sogan dominant only where needed?
- Is Indigo used consistently for interaction?
- Are semantic colors separate from brand colors?

## Components
- Is this card actually necessary?
- Is there one clear primary action?
- Is related knowledge easy to discover?

## Accessibility
- Keyboard accessible?
- Visible focus?
- Contrast acceptable?
- Reduced motion?
- Touch targets sufficient?
- Essential information available without hover?

## Content
- Does the page explain context, not only facts?
- Are regional differences represented?
- Are terms linked meaningfully?
- Is there a clear “next path”?

---

# 90. Final Design Definition

Njawani should visually and behaviorally communicate:

> **Tradition with purpose.**
>
> **Quiet depth.**
>
> **Rasa before information.**
>
> **Plural Jawa.**
>
> **Connected knowledge.**

Its visual signature is:

> **Gading yang hangat + Sogan sebagai identitas + Indigo sebagai interaksi + tipografi editorial + whitespace luas + elemen Jawa yang subtil dan bermakna.**

Its UX signature is:

> **Hover untuk memahami, klik untuk menyelami, scroll untuk menemukan konteks, dan relasi untuk melanjutkan perjalanan.**

Its anti-pattern principle is:

> **Jangan membuat UI modern yang ditempeli ornamen Jawa. Buat UI modern yang cara berpikir visualnya terinspirasi Jawa.**

Njawani harus terasa seperti:

> **publikasi budaya kontemporer yang bertemu dengan knowledge product modern.**
