import { describe, expect, it } from "vitest";

import {
  calculateTargetSeconds,
  formatClock,
  isValidPower,
  parseRawTime,
} from "../src/app/logic";

import { POWER_MAX, POWER_MIN } from "../src/app/constants";

describe("isValidPower", () => {
  it("最小値と最大値を含めて許容する", () => {
    expect(isValidPower(POWER_MIN)).toBe(true);
    expect(isValidPower(POWER_MAX)).toBe(true);
  });

  it("範囲外や非整数を弾く", () => {
    expect(isValidPower(POWER_MIN - 1)).toBe(false);
    expect(isValidPower(POWER_MAX + 1)).toBe(false);
    expect(isValidPower(500.5)).toBe(false);
  });
});

describe("parseRawTime", () => {
  it("4桁未満でもゼロ埋めして正規化する", () => {
    const result = parseRawTime("90");
    expect(result).toEqual({ minutes: 1, seconds: 30, totalSeconds: 90 });
  });

  it("4桁入力はそのまま扱い合計秒を返す", () => {
    const result = parseRawTime("1234");
    expect(result).toEqual({ minutes: 12, seconds: 34, totalSeconds: 754 });
  });
});

describe("formatClock", () => {
  it("分秒をゼロ埋めした文字列に整形する", () => {
    expect(formatClock(3, 7)).toBe("03:07");
  });
});

describe("calculateTargetSeconds", () => {
  it("出力比率に応じて秒数を四捨五入する", () => {
    expect(calculateTargetSeconds(500, 600, 180)).toBe(150);
    expect(calculateTargetSeconds(600, 1000, 90)).toBe(54);
  });

  it("四捨五入の境界を考慮する", () => {
    expect(calculateTargetSeconds(700, 600, 10)).toBe(12);
    expect(calculateTargetSeconds(600, 700, 10)).toBe(9);
  });
});
