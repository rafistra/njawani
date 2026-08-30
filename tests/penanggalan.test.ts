import { describe, expect, it } from "vitest";
import { fromJdn, toJdn } from "../src/lib/penanggalan/jdn";
import { getDina } from "../src/lib/penanggalan/dina";
import { getPasaran } from "../src/lib/penanggalan/pasaran";
import { getWuku } from "../src/lib/penanggalan/wuku";
import { getWulanTaunJawa } from "../src/lib/penanggalan/tahun";
import { ARANING_TAUN, formatTanggalMasehi, getHariJawa, WULAN_NAMES, WUKU_NAMES } from "../src/lib/penanggalan";

/**
 * Fixture diambil dari pasangan tanggal terdokumentasi (bukan hasil hitung
 * mandiri): Kalender Bank Indonesia/Kemenag 2025, kalender Jawa 2026 yang
 * beredar, dan epoch Dershowitz & Reingold via Wikipedia "Pawukon".
 * Sumber per anchor: src/lib/penanggalan/anchors.ts.
 */
describe("JDN (Julian Day Number)", () => {
  it("menghitung JDN referensi baku", () => {
    expect(toJdn({ year: 2000, month: 1, day: 1 })).toBe(2451545);
    expect(toJdn({ year: 1945, month: 8, day: 17 })).toBe(2431685);
  });

  it("round-trip Gregorian ↔ JDN di rentang 1600–2200", () => {
    for (let year = 1600; year <= 2200; year++) {
      for (const [month, day] of [
        [1, 1],
        [2, 28],
        [7, 15],
        [12, 31],
      ] as const) {
        const tanggal = { year, month, day };
        expect(fromJdn(toJdn(tanggal))).toEqual(tanggal);
      }
    }
  });
});

describe("siklus dina dan pasaran (dokumentasi harian)", () => {
  it("27 Juni 2025 = Jemuah Kliwon, 1 Sura 1959 Dal (Kalender BI/Kemenag)", () => {
    const hari = getHariJawa({ year: 2025, month: 6, day: 27 });
    expect(hari.dina.nama).toBe("Jemuah");
    expect(hari.pasaran.nama).toBe("Kliwon");
    expect(hari.weton.nama).toBe("Jemuah Kliwon");
    expect(hari.wulan.nama).toBe("Sura");
    expect(hari.wulan.dina).toBe(1);
    expect(hari.taun).toEqual({ angka: 1959, nama: "Dal", urutanDalamWindu: 5 });
  });

  it("1 Agustus 2025 = Jemuah Kliwon, 6 Sapar 1959 (kalender harian)", () => {
    const hari = getHariJawa({ year: 2025, month: 8, day: 1 });
    expect(hari.weton.nama).toBe("Jemuah Kliwon");
    expect(hari.wulan.nama).toBe("Sapar");
    expect(hari.wulan.dina).toBe(6);
    expect(hari.taun.angka).toBe(1959);
  });

  it("1 Januari 2026 = Kemis Pon, 12 Rejeb 1959 Dal, wuku Kuruwelut", () => {
    const hari = getHariJawa({ year: 2026, month: 1, day: 1 });
    expect(hari.dina.nama).toBe("Kemis");
    expect(hari.pasaran.nama).toBe("Pon");
    expect(hari.wulan.nama).toBe("Rejeb");
    expect(hari.wulan.dina).toBe(12);
    expect(hari.taun).toEqual({ angka: 1959, nama: "Dal", urutanDalamWindu: 5 });
    expect(hari.wuku.nama).toBe("Kuruwelut");
    expect(hari.wuku.urutan).toBe(17);
  });

  it("20 Januari 2026 = Selasa Pahing, 1 Ruwah 1959, wuku Medangkungan hari ke-3", () => {
    const hari = getHariJawa({ year: 2026, month: 1, day: 20 });
    expect(hari.dina.nama).toBe("Selasa");
    expect(hari.pasaran.nama).toBe("Pahing");
    expect(hari.wulan.nama).toBe("Ruwah");
    expect(hari.wulan.dina).toBe(1);
    expect(hari.wuku.nama).toBe("Medangkungan");
    expect(hari.wuku.dinaWuku).toBe(3);
  });

  it("10 Agustus 2021 = Selasa Pon, 1 Sura 1955 Alip (Tahun Baru 1443 H)", () => {
    const hari = getHariJawa({ year: 2021, month: 8, day: 10 });
    expect(hari.dina.nama).toBe("Selasa");
    expect(hari.pasaran.nama).toBe("Pon");
    expect(hari.wulan.nama).toBe("Sura");
    expect(hari.wulan.dina).toBe(1);
    expect(hari.taun).toEqual({ angka: 1955, nama: "Alip", urutanDalamWindu: 1 });
  });

  it("5 Juli 2020 = hari-1 wuku Sinta, Redite Pahing (epoch Dershowitz & Reingold)", () => {
    const jdn = toJdn({ year: 2020, month: 7, day: 5 });
    expect(getWuku(jdn)).toEqual({ id: "sinta", nama: "Sinta", urutan: 1, dinaWuku: 1 });
    expect(getDina(jdn).nama).toBe("Minggu");
    expect(getPasaran(jdn).nama).toBe("Pahing");
  });

  it("1 Sura 1951 berulang persis tiap windu: Jemuah Kliwon (2.835 ≡ 0 mod 35)", () => {
    // 1 Sura 1959 − 1 windu (8 taun lunar) = 1 Sura 1951 (Dal juga).
    const jdn = 2460854 - 2835;
    const { wulan, taun } = getWulanTaunJawa(jdn);
    expect(wulan).toEqual({ id: "sura", nama: "Sura", urutan: 1, dina: 1 });
    expect(taun.angka).toBe(1951);
    expect(taun.nama).toBe("Dal");
    expect(getDina(jdn).nama).toBe("Jemuah");
    expect(getPasaran(jdn).nama).toBe("Kliwon");
  });
});

describe("fakta struktural pawukon", () => {
  it('nama siklus: 30 wuku, 12 wulan, 8 araning taun', () => {
    expect(WUKU_NAMES).toHaveLength(30);
    expect(WULAN_NAMES).toHaveLength(12);
    expect(ARANING_TAUN).toHaveLength(8);
  });

  it('"Setu-Pon ana ing wuku Wugu" (jv-Wikipedia)', () => {
    // JDN 327 = hari ke-182 siklus = Sabtu wuku ke-26.
    const jdn = 327;
    expect(getDina(jdn).nama).toBe("Setu");
    expect(getPasaran(jdn).nama).toBe("Pon");
    expect(getWuku(jdn)).toMatchObject({ nama: "Wugu", urutan: 26 });
  });

  it("Galungan = Buda Kliwon wuku Galungan; Kuningan = Setu Kliwon wuku Kuningan", () => {
    const galungan = 219; // hari ke-74 siklus = Buda wuku ke-11
    expect(getDina(galungan).nama).toBe("Rebo");
    expect(getPasaran(galungan).nama).toBe("Kliwon");
    expect(getWuku(galungan)).toMatchObject({ nama: "Galungan", urutan: 11 });

    const kuningan = 229; // hari ke-84 siklus = Setu wuku ke-12
    expect(getDina(kuningan).nama).toBe("Setu");
    expect(getPasaran(kuningan).nama).toBe("Kliwon");
    expect(getWuku(kuningan)).toMatchObject({ nama: "Kuningan", urutan: 12 });
  });

  it("taun basa Dal 1959 punya Besar 30 hari (355 hari)", () => {
    const { wulan, taun } = getWulanTaunJawa(2460854 + 354);
    expect(taun.angka).toBe(1959);
    expect(wulan.nama).toBe("Besar");
    expect(wulan.dina).toBe(30);
  });

  it("siklus wuku wrap-around: JDN 145 dan 355 sama-sama akhir wuku Watugunung", () => {
    expect(getWuku(146 - 1)).toEqual(getWuku(146 + 209));
  });
});

describe("API murni & deterministik", () => {
  it("panggilan berulang memberi hasil identik", () => {
    const tanggal = { year: 2026, month: 8, day: 31 };
    expect(getHariJawa(tanggal)).toEqual(getHariJawa(tanggal));
  });

  it("31 Agustus 2026 (hari rilis) = Senen Kliwon, 17 Mulud 1960 Bé, wuku Wuye", () => {
    const hari = getHariJawa({ year: 2026, month: 8, day: 31 });
    expect(hari.weton.nama).toBe("Senen Kliwon");
    expect(hari.wulan.nama).toBe("Mulud");
    expect(hari.wulan.dina).toBe(17);
    expect(hari.taun).toEqual({ angka: 1960, nama: "Bé", urutanDalamWindu: 6 });
    expect(hari.wuku.nama).toBe("Wuye");
  });

  it("tanggal Masehi diformat Indonesia tanpa geser zona waktu", () => {
    expect(formatTanggalMasehi({ year: 2026, month: 8, day: 31 })).toBe("31 Agustus 2026");
    expect(formatTanggalMasehi({ year: 2025, month: 6, day: 27 })).toBe("27 Juni 2025");
  });
});
