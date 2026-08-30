/**
 * Format tampilan (label saja — bukan logika kalender).
 * Nama dina/pasaran/wuku tetap datang dari modul masing-masing agar
 * konsisten dengan entri `dina-lan-pasaran`.
 */
import type { TanggalMasehi } from "./jdn";

const formatTanggal = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC", // tanggal diberikan eksplisit; zona waktu tidak boleh menggesernya
});

/** "31 Agustus 2026" — tanpa nama hari, karena nama hari Jawa datang dari siklus dina. */
export function formatTanggalMasehi(tanggal: TanggalMasehi): string {
  return formatTanggal.format(Date.UTC(tanggal.year, tanggal.month - 1, tanggal.day));
}
