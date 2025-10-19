import { describe, expect, it } from "vitest";

import {
  calculateTargetSeconds,
  formatClock,
  isValidPower,
  parseRawTime,
} from "../src/app/logic";

import { POWER_MAX, POWER_MIN } from "../src/app/constants";

describe("isValidPower", () => {
  it("accepts values within the inclusive range", () => {
    expect(isValidPower(POWER_MIN)).toBe(true);
    expect(isValidPower(POWER_MAX)).toBe(true);
  });

  it("rejects out-of-range values and non-integers", () => {
    expect(isValidPower(POWER_MIN - 1)).toBe(false);
    expect(isValidPower(POWER_MAX + 1)).toBe(false);
    expect(isValidPower(500.5)).toBe(false);
  });
});

describe("parseRawTime", () => {
  it("pads input shorter than four digits and normalizes", () => {
    const result = parseRawTime("90");
    expect(result).toEqual({ minutes: 1, seconds: 30, totalSeconds: 90 });
  });

  it("handles four-digit input and returns total seconds", () => {
    const result = parseRawTime("1234");
    expect(result).toEqual({ minutes: 12, seconds: 34, totalSeconds: 754 });
  });
});

describe("formatClock", () => {
  it("formats minutes and seconds with zero padding", () => {
    expect(formatClock(3, 7)).toBe("03:07");
  });
});

describe("calculateTargetSeconds", () => {
  it("rounds seconds based on the power ratio", () => {
    expect(calculateTargetSeconds(500, 600, 180)).toBe(150);
    expect(calculateTargetSeconds(600, 1000, 90)).toBe(54);
  });

  it("handles rounding boundaries", () => {
    expect(calculateTargetSeconds(700, 600, 10)).toBe(12);
    expect(calculateTargetSeconds(600, 700, 10)).toBe(9);
  });
});
