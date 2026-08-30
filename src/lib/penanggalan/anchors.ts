/**
 * SEMUA epoch/anchor penanggalan Jawa terpusat di sini (AGENTS.md §63:
 * satu sumber kebenaran, tidak diduplikasi). Setiap konstanta diverifikasi
 * terhadap pasangan tanggal terdokumentasi sebelum dibekukan; sumbernya
 * dicatat di komentar dan di source object `src/content/sources/`.
 *
 * Rentang berlaku: kurup Asapon (1 Sura Alip 1867 ≈ 1936 M s.d. akhir
 * Jimakir 1986 ≈ 2053 M). Melewati batas kurup butuh aturan pembuangan
 * 1 hari per 120 tahun — belum diimplementasikan.
 */

/** 1 Sura 1959 (Dal) = 27 Juni 2025, Jemuah Kliwon — Kalender Bank Indonesia
 * 2025 / Kemenag (bertepatan 1 Muharram 1447 H). Anchor kalender lunar. */
export const LUNAR_ANCHOR_JDN = 2460854;
export const LUNAR_ANCHOR_TAUN = 1959;

/**
 * Kurup Asapon dimulai 1 Sura Alip 1867 (≈ 1936 M); tabel windu id-Wikipedia
 * "Kalender Jawa" menetapkan 1 Sura Alip = Selasa Pon, dan taun basa (355 hari)
 * adalah Éhé, Dal, Jimakir — posisi ke-2, ke-5, ke-8 tiap windu.
 * Nama taun ⇒ (taun − KURUP_ALIP_TAHUN) mod 8.
 */
export const KURUP_ALIP_TAHUN = 1867;

/**
 * Hari pertama satu siklus wuku (210 hari) pada JDN 146 — Dershowitz &
 * Reingold, "Calendrical Calculations", via Wikipedia "Pawukon". Verifikasi:
 * 5 Juli 2020 (JDN 2459036) jatuh pada hari-1 wuku Sinta, Redite Pahing.
 */
export const WUKU_EPOCH_JDN = 146;

/**
 * Fase siklus harian: JDN mod 7 → 0 = Senen … 6 = Minggu, dan
 * JDN mod 5 → 0 = Legi … 4 = Kliwon. Terverifikasi silang:
 * 27 Juni 2025 = Jemuah Kliwon, 1 Januari 2026 = Kemis Pon,
 * serta fakta struktural "Setu-Pon ana ing wuku Wugu" (jv-Wikipedia).
 */
export const DINA_OFFSET = 0;
export const PASARAN_OFFSET = 0;
