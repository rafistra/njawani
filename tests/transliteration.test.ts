import { describe, expect, it } from "vitest";

import { transliterate } from "../src/lib/transliteration";

/**
 * Kasus uji: hanya pasangan aksara Latin → Jawa yang baku dan dapat
 * diverifikasi (AGENTS.md §54 — tanpa fakta yang dikarang).
 * "Jawa ꦗꦮ" adalah contoh resmi design.md §18.
 */
describe("transliterasi Latin → Aksara Jawa", () => {
  it("suku kata terbuka tanpa vokal eksplisit", () => {
    expect(transliterate("jawa")).toBe("ꦗꦮ");
    expect(transliterate("basa")).toBe("ꦧꦱ");
  });

  it("suku kata tertutup di akhir kata memakai pangkon", () => {
    expect(transliterate("mangan")).toBe("ꦩꦔꦤ꧀");
  });

  it("vokal i dan u memakai wulu dan suku", () => {
    expect(transliterate("siji")).toBe("ꦱꦶꦗꦶ");
    expect(transliterate("wulan")).toBe("ꦮꦸꦭꦤ꧀");
  });

  it("medial r memakai cakra", () => {
    expect(transliterate("krama")).toBe("ꦏꦿꦩ");
  });

  it("vokal e (taling) dan o (taling + tarung)", () => {
    expect(transliterate("keraton")).toBe("ꦏꦺꦫꦠꦺꦴꦤ꧀");
  });

  it("vokal ê/è (pepet)", () => {
    expect(transliterate("sêkatên")).toBe("ꦱꦼꦏꦠꦼꦤ꧀");
    expect(transliterate("ngêlmu")).toBe("ꦔꦼꦭ꧀ꦩꦸ");
  });

  it("penutup akhir kata: -r layar, -ng cecak, -h wigyangan", () => {
    expect(transliterate("bakar")).toBe("ꦧꦏꦂ");
    expect(transliterate("barang")).toBe("ꦧꦫꦁ");
    expect(transliterate("sekolah")).toBe("ꦱꦺꦏꦺꦴꦭꦃ");
  });

  it("klaster internal dirender sebagai pasangan lewat pangkon", () => {
    expect(transliterate("ngêlmu")).toBe("ꦔꦼꦭ꧀ꦩꦸ");
    expect(transliterate("sambêl")).toBe("ꦱꦩ꧀ꦧꦼꦭ꧀");
  });

  it("spasi, tanda baca, dan angka dilewatkan; huruf besar distandarkan", () => {
    expect(transliterate("Basa Jawa.")).toBe("ꦧꦱ ꦗꦮ.");
    expect(transliterate("jawa 2")).toBe("ꦗꦮ 2");
  });
});
