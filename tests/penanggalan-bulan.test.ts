import { describe, expect, it } from "vitest";
import {
  buildBulanKalender,
  geserBulan,
  panjangBulan,
  type SelKalender,
} from "../src/lib/penanggalan/bulan";
import { formatTanggalJawa, getHariJawa } from "../src/lib/penanggalan";
import { fromJdn } from "../src/lib/penanggalan/jdn";

/** Fixture Agustus 2026 mengikuti kalender Jawa Agustus 2026 yang beredar
 *  (gambar referensi halaman kalender) dan fixture terverifikasi di
 *  tests/penanggalan.test.ts. */
describe("buildBulanKalender", () => {
  it("Agustus 2026: 31 hari, 6 pekan, 1 Agustus di kolom Setu", () => {
    const bulan = buildBulanKalender(2026, 8);
    const sel = bulan.pekan.flat().filter((s): s is SelKalender => s !== null);

    expect(sel).toHaveLength(31);
    expect(bulan.pekan).toHaveLength(6);

    const pekanPertama = bulan.pekan[0];
    expect(pekanPertama.slice(0, 6)).toEqual([null, null, null, null, null, null]);
    expect(pekanPertama[6]?.tanggal).toEqual({ year: 2026, month: 8, day: 1 });
    expect(pekanPertama[6]?.hari.dina.nama).toBe("Setu");

    const pekanTerakhir = bulan.pekan[5];
    expect(pekanTerakhir[0]?.tanggal).toEqual({ year: 2026, month: 8, day: 30 });
    expect(pekanTerakhir[1]?.tanggal).toEqual({ year: 2026, month: 8, day: 31 });
    expect(pekanTerakhir.slice(2)).toEqual([null, null, null, null, null]);
  });

  it("Agustus 2026: label awalWuku tepat di Ahad — Marakeh s.d. Wuye", () => {
    const bulan = buildBulanKalender(2026, 8);
    const sel = bulan.pekan.flat().filter((s): s is SelKalender => s !== null);
    const awalWuku = sel.filter((s) => s.awalWuku);

    expect(awalWuku.map((s) => s.tanggal.day)).toEqual([2, 9, 16, 23, 30]);
    expect(awalWuku.map((s) => s.hari.dina.nama)).toEqual([
      "Ahad",
      "Ahad",
      "Ahad",
      "Ahad",
      "Ahad",
    ]);
    expect(awalWuku.map((s) => s.hari.wuku.nama)).toEqual([
      "Marakeh",
      "Tambir",
      "Medangkungan",
      "Maktal",
      "Wuye",
    ]);
  });

  it("Agustus 2026: 31 Agustus = Senen Kliwon, 17 Mulud 1960 Bé, wuku Wuye", () => {
    const bulan = buildBulanKalender(2026, 8);
    const terakhir = bulan.pekan[5][1];
    expect(terakhir?.hari.weton.nama).toBe("Senen Kliwon");
    expect(terakhir?.hari.wulan.dina).toBe(17);
    expect(terakhir?.hari.taun).toEqual({ angka: 1960, nama: "Bé", urutanDalamWindu: 6 });
    expect(terakhir?.hari.wuku.nama).toBe("Wuye");
    expect(formatTanggalJawa(terakhir!.hari)).toBe("17 Mulud 1960 Bé");
  });

  it("sel bersambung: JDN tiap sel naik satu, round-trip tanggal identitas", () => {
    for (const [tahun, bulan] of [
      [2026, 8],
      [2024, 2],
      [1999, 12],
    ] as const) {
      const kalender = buildBulanKalender(tahun, bulan);
      const sel = kalender.pekan.flat().filter((s): s is SelKalender => s !== null);
      sel.forEach((s, i) => {
        if (i > 0) expect(s.hari.jdn).toBe(sel[i - 1].hari.jdn + 1);
        expect(fromJdn(s.hari.jdn)).toEqual(s.tanggal);
        expect(getHariJawa(s.tanggal)).toEqual(s.hari);
      });
    }
  });

  it("Februari kabisat 2024: 29 hari, 29 Februari ada di pekan terakhir", () => {
    const bulan = buildBulanKalender(2024, 2);
    const sel = bulan.pekan.flat().filter((s): s is SelKalender => s !== null);
    expect(sel).toHaveLength(29);
    const terakhir = sel[sel.length - 1];
    expect(terakhir.tanggal).toEqual({ year: 2024, month: 2, day: 29 });
  });

  it("Februari 2026: mulai Ahad dan berakhir Setu — 4 pekan penuh tanpa sel kosong", () => {
    const bulan = buildBulanKalender(2026, 2);
    expect(bulan.pekan).toHaveLength(4);
    for (const pekan of bulan.pekan) {
      expect(pekan.every((s) => s !== null)).toBe(true);
    }
  });

  it("input bulan tidak valid melempar error eksplisit", () => {
    expect(() => buildBulanKalender(2026, 0)).toThrow();
    expect(() => buildBulanKalender(2026, 13)).toThrow();
    expect(() => buildBulanKalender(2026.5, 8)).toThrow();
  });
});

describe("geserBulan", () => {
  it("rollover Desember → Januari tahun berikutnya, dan sebaliknya", () => {
    expect(geserBulan(2026, 12, 1)).toEqual({ tahun: 2027, bulan: 1 });
    expect(geserBulan(2026, 1, -1)).toEqual({ tahun: 2025, bulan: 12 });
    expect(geserBulan(2026, 8, -1)).toEqual({ tahun: 2026, bulan: 7 });
    expect(geserBulan(2026, 8, 1)).toEqual({ tahun: 2026, bulan: 9 });
  });

  it("delta lebih dari satu bulan tetap konsisten", () => {
    expect(geserBulan(2026, 8, 12)).toEqual({ tahun: 2027, bulan: 8 });
    expect(geserBulan(2026, 8, -20)).toEqual({ tahun: 2024, bulan: 12 });
  });

  it("input tidak valid melempar error eksplisit", () => {
    expect(() => geserBulan(2026, 13, 1)).toThrow();
    expect(() => geserBulan(2026, 8, 0.5)).toThrow();
  });
});

describe("panjangBulan", () => {
  it("panjang bulan Masehi — termasuk Desember (rollover) dan Februari kabisat", () => {
    expect(panjangBulan(2026, 8)).toBe(31);
    expect(panjangBulan(2026, 12)).toBe(31);
    expect(panjangBulan(2026, 9)).toBe(30); // tujuan clamp 31 Agu → 30 Sep
    expect(panjangBulan(2026, 2)).toBe(28);
    expect(panjangBulan(2024, 2)).toBe(29); // kabisat
    expect(panjangBulan(2000, 2)).toBe(29); // kabisat abad (habis dibagi 400)
    expect(panjangBulan(1900, 2)).toBe(28); // bukan kabisat (habis dibagi 100)
  });

  it("selalu sama dengan jumlah sel buildBulanKalender", () => {
    for (const [tahun, bulan] of [
      [2026, 8],
      [2024, 2],
      [1999, 12],
    ] as const) {
      const jumlahSel = buildBulanKalender(tahun, bulan)
        .pekan.flat()
        .filter((s): s is SelKalender => s !== null).length;
      expect(panjangBulan(tahun, bulan)).toBe(jumlahSel);
    }
  });

  it("input bulan tidak valid melempar error eksplisit", () => {
    expect(() => panjangBulan(2026, 0)).toThrow();
    expect(() => panjangBulan(2026, 13)).toThrow();
  });
});
