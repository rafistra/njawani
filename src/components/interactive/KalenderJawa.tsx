/**
 * KalenderJawa island (AGENTS.md §48, §49): React hanya menangani
 * interaksi — memilih tanggal, melangkah hari/bulan, navigasi keyboard
 * grid, dan sinkronisasi state ?tgl= ke URL agar tanggal bisa dibagikan.
 * Seluruh aritmetika kalender ada di src/lib/penanggalan.
 *
 * Tanpa JS, island menampilkan catatan jujur (fallback §8); penjelasan
 * siklus tetap tersedia sebagai konten statis halaman.
 */
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import {
  DINA_NAMES,
  TAHUN_MASEHI_MAX,
  TAHUN_MASEHI_MIN,
  buildBulanKalender,
  formatTanggalJawa,
  formatTanggalMasehi,
  fromJdn,
  geserBulan,
  getHariJawa,
  panjangBulan,
  toJdn,
  type TanggalMasehi,
} from "../../lib/penanggalan";

import "./KalenderJawa.css";

/** Rentang berlaku kurup Asapon — batas pilihan tanggal di UI. */
const BATAS_BAWAH: TanggalMasehi = { year: TAHUN_MASEHI_MIN, month: 1, day: 1 };
const BATAS_ATAS: TanggalMasehi = { year: TAHUN_MASEHI_MAX, month: 12, day: 31 };

/** Header kolom pekan pawukon: Ahad dulu, karena wuku selalu berawal Ahad. */
const KOLOM_DINA = [DINA_NAMES[6], ...DINA_NAMES.slice(0, 6)];

const NAMA_BULAN = new Intl.DateTimeFormat("id-ID", { month: "long", timeZone: "UTC" });

// "Dina iki" mengikuti kalender perangkat pengunjung — keputusan zona
// waktu ada di layer UI; modul menerima {year, month, day} eksplisit.
function hariIni(): TanggalMasehi {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
}

function sama(a: TanggalMasehi, b: TanggalMasehi): boolean {
  return a.year === b.year && a.month === b.month && a.day === b.day;
}

function iso(tanggal: TanggalMasehi): string {
  const dua = (n: number) => String(n).padStart(2, "0");
  return `${tanggal.year}-${dua(tanggal.month)}-${dua(tanggal.day)}`;
}

/** Valid = tanggal nyata (round-trip JDN) dan di dalam rentang kurup. */
function tanggalValid(tanggal: TanggalMasehi): boolean {
  if (tanggal.year < TAHUN_MASEHI_MIN || tanggal.year > TAHUN_MASEHI_MAX) return false;
  return sama(fromJdn(toJdn(tanggal)), tanggal);
}

/** Baca & validasi ?tgl=YYYY-MM-DD dari URL; null bila tidak ada/tidak valid. */
function dariUrl(): TanggalMasehi | null {
  const param = new URLSearchParams(window.location.search).get("tgl");
  if (!param) return null;
  const cocok = /^(\d{4})-(\d{2})-(\d{2})$/.exec(param);
  if (!cocok) return null;
  const tanggal = {
    year: Number(cocok[1]),
    month: Number(cocok[2]),
    day: Number(cocok[3]),
  };
  return tanggalValid(tanggal) ? tanggal : null;
}

/** Panah pada tombol hari → pergeseran hari dalam JDN (roving tabindex). */
const ARAH_HARI: Record<string, number> = {
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -7,
  ArrowDown: 7,
};

/** Apakah bulan (tahun, bulan) masih di dalam rentang kurup Asapon? */
function bulanDalamRentang(tahun: number, bulan: number): boolean {
  const kunci = tahun * 12 + bulan;
  return TAHUN_MASEHI_MIN * 12 + 1 <= kunci && kunci <= TAHUN_MASEHI_MAX * 12 + 12;
}

export default function KalenderJawa() {
  const [terpilih, setTerpilih] = useState<TanggalMasehi | null>(null);
  const [kini, setKini] = useState<TanggalMasehi | null>(null);
  // Roving tabindex (AGENTS.md §46): grid satu tab stop — peta tombol hari
  // untuk memindahkan fokus setelah perubahan lewat keyboard.
  const tombolHari = useRef(new Map<string, HTMLButtonElement>());
  const fokusBerikutnya = useRef<string | null>(null);

  useEffect(() => {
    setKini(hariIni());
    // ?tgl= yang valid menang atas hari ini; URL bersih artinya hari ini.
    setTerpilih(dariUrl() ?? hariIni());
  }, []);

  // Setelah render akibat pilihan keyboard, fokus mengikuti tanggal baru.
  useEffect(() => {
    if (!fokusBerikutnya.current) return;
    tombolHari.current.get(fokusBerikutnya.current)?.focus();
    fokusBerikutnya.current = null;
  });

  const pilih = (tanggal: TanggalMasehi) => {
    if (!tanggalValid(tanggal)) return;
    setTerpilih(tanggal);
    const url = new URL(window.location.href);
    url.searchParams.set("tgl", iso(tanggal));
    window.history.replaceState(null, "", url);
  };

  /** Jalur keyboard: pilih + antrekan perpindahan fokus ke tanggal baru. */
  const pilihViaKeyboard = (tanggal: TanggalMasehi) => {
    if (!tanggalValid(tanggal)) return;
    fokusBerikutnya.current = iso(tanggal);
    pilih(tanggal);
  };

  if (!terpilih || !kini) {
    return (
      <div className="kal">
        <p className="kal-fallback">
          Kalender interaktif membutuhkan JavaScript. Penjelasan siklus
          penanggalan Jawa tetap tersedia di bagian bawah halaman ini.
        </p>
      </div>
    );
  }

  const langkah = (delta: number) => {
    const tetangga = fromJdn(toJdn(terpilih) + delta);
    pilih(tetangga);
  };
  const bisaLangkah = (delta: number) => tanggalValid(fromJdn(toJdn(terpilih) + delta));

  /** Pindah bulan: hari sama, di-clamp ke panjang bulan tujuan (31 Agu → 30 Sep). */
  const geserKeBulan = (delta: number, viaKeyboard = false) => {
    const target = geserBulan(terpilih.year, terpilih.month, delta);
    if (!bulanDalamRentang(target.tahun, target.bulan)) return;
    const tanggal = {
      year: target.tahun,
      month: target.bulan,
      day: Math.min(terpilih.day, panjangBulan(target.tahun, target.bulan)),
    };
    if (viaKeyboard) pilihViaKeyboard(tanggal);
    else pilih(tanggal);
  };

  const bisaGeserBulan = (delta: number) => {
    const target = geserBulan(terpilih.year, terpilih.month, delta);
    return bulanDalamRentang(target.tahun, target.bulan);
  };

  /** Roving tabindex pada grid (AGENTS.md §46, §73): panah = ±1/±7 hari,
      PageUp/PageDown = pindah bulan, Home/End = awal/akhir bulan. */
  const padaTombolHari = (event: KeyboardEvent<HTMLButtonElement>) => {
    const delta = ARAH_HARI[event.key];
    if (delta !== undefined) {
      event.preventDefault();
      pilihViaKeyboard(fromJdn(toJdn(terpilih) + delta));
    } else if (event.key === "PageUp" || event.key === "PageDown") {
      event.preventDefault();
      geserKeBulan(event.key === "PageUp" ? -1 : 1, true);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      pilihViaKeyboard({
        year: terpilih.year,
        month: terpilih.month,
        day: event.key === "Home" ? 1 : panjangBulan(terpilih.year, terpilih.month),
      });
    }
  };

  const bulanKini = buildBulanKalender(terpilih.year, terpilih.month);
  const hari = getHariJawa(terpilih);
  const judulBulan = `${NAMA_BULAN.format(Date.UTC(terpilih.year, terpilih.month - 1, 1))} ${terpilih.year}`;

  return (
    <div className="kal">
      <div className="kal-kontrol">
        <label className="kal-label" htmlFor="kal-tanggal">
          Tanggal
        </label>
        <div className="kal-kontrol-baris">
          <input
            id="kal-tanggal"
            type="date"
            value={iso(terpilih)}
            min={iso(BATAS_BAWAH)}
            max={iso(BATAS_ATAS)}
            onChange={(event) => {
              const nilai = event.target.value;
              if (!nilai) return;
              const [year, month, day] = nilai.split("-").map(Number);
              pilih({ year, month, day });
            }}
          />
          <div className="kal-langkah" role="group" aria-label="Geser satu hari">
            <button
              type="button"
              onClick={() => langkah(-1)}
              disabled={!bisaLangkah(-1)}
              aria-label="Sehari sebelumnya"
            >
              &minus;1
            </button>
            <button
              type="button"
              onClick={() => langkah(1)}
              disabled={!bisaLangkah(1)}
              aria-label="Sehari sesudahnya"
            >
              +1
            </button>
          </div>
          <button type="button" className="kal-hari-ini" onClick={() => pilih(kini)}>
            Hari ini
          </button>
        </div>
      </div>

      <div className="kal-judul-baris">
        <h2 className="kal-judul-bulan">
          {NAMA_BULAN.format(Date.UTC(terpilih.year, terpilih.month - 1, 1))}{" "}
          <strong>{terpilih.year}</strong>
        </h2>
        <div className="kal-navigasi-bulan" role="group" aria-label="Pindah bulan">
          <button
            type="button"
            onClick={() => geserKeBulan(-1)}
            disabled={!bisaGeserBulan(-1)}
            aria-label="Ke bulan sebelumnya"
          >
            &lsaquo;
          </button>
          <button
            type="button"
            onClick={() => geserKeBulan(1)}
            disabled={!bisaGeserBulan(1)}
            aria-label="Ke bulan sesudahnya"
          >
            &rsaquo;
          </button>
        </div>
      </div>

      <table className="kal-grid">
        <caption className="sr-only">Kalender {judulBulan}: tiap hari dengan pasaran, tanggal jawa, dan wuku</caption>
        <thead>
          <tr>
            {KOLOM_DINA.map((nama) => (
              <th scope="col" key={nama}>
                {nama}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bulanKini.pekan.map((pekan, i) => (
            <tr key={i}>
              {pekan.map((sel, j) =>
                sel ? (
                  <td key={j}>
                    <button
                      type="button"
                      ref={(el) => {
                        const kunci = iso(sel.tanggal);
                        if (el) tombolHari.current.set(kunci, el);
                        else tombolHari.current.delete(kunci);
                      }}
                      tabIndex={sama(terpilih, sel.tanggal) ? 0 : -1}
                      onKeyDown={padaTombolHari}
                      className={`kal-sel${sama(terpilih, sel.tanggal) ? " kal-terpilih" : ""}`}
                      aria-pressed={sama(terpilih, sel.tanggal)}
                      aria-current={sama(kini, sel.tanggal) ? "date" : undefined}
                      aria-label={`${formatTanggalMasehi(sel.tanggal)}, ${sel.hari.weton.nama}, ${sel.hari.wulan.dina} ${sel.hari.wulan.nama}, wuku ${sel.hari.wuku.nama}`}
                      onClick={() => pilih(sel.tanggal)}
                    >
                      <span className="kal-angka">
                        {sel.tanggal.day}
                        {sama(kini, sel.tanggal) && (
                          <i className="kal-titik-kini" aria-hidden="true" />
                        )}
                      </span>
                      <span className="kal-pasaran">
                        <span className="kal-dots" aria-hidden="true">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <i
                              key={n}
                              className={n === sel.hari.pasaran.urutan ? "kal-dot kal-dot-terisi" : "kal-dot"}
                            />
                          ))}
                        </span>
                        {sel.hari.pasaran.nama}
                      </span>
                      <span className="kal-tanggal-jawa">
                        {sel.hari.wulan.dina} {sel.hari.wulan.nama}
                      </span>
                      {sel.awalWuku && <span className="kal-wuku">{sel.hari.wuku.nama}</span>}
                    </button>
                  </td>
                ) : (
                  <td key={j} className="kal-kosong" />
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <p className="kal-keterangan">
        Baris kecil di bawah tanggal: pasaran, tanggal jawa, dan wuku.
      </p>

      <dl className="kal-fakta" aria-live="polite">
        <div className="kal-baris">
          <dt>Weton</dt>
          <dd>{hari.weton.nama}</dd>
        </div>
        <div className="kal-baris">
          <dt>Tanggal Jawa</dt>
          <dd>{formatTanggalJawa(hari)}</dd>
        </div>
        <div className="kal-baris">
          <dt>Wuku</dt>
          <dd>{hari.wuku.nama}</dd>
        </div>
        <div className="kal-baris">
          <dt>JDN</dt>
          <dd>{hari.jdn}</dd>
        </div>
      </dl>
    </div>
  );
}
