import { POWER_MAX, POWER_MIN, TIME_DIGITS } from "./constants";
import type { TimeParts } from "./types";

export function isValidPower(value: number): boolean {
  return Number.isInteger(value) && value >= POWER_MIN && value <= POWER_MAX;
}

export function parseRawTime(raw: string): TimeParts {
  const padded = raw.padStart(TIME_DIGITS, "0");
  const minutesPart = Number(padded.slice(0, 2));
  const secondsPart = Number(padded.slice(2, 4));
  const totalSeconds = minutesPart * 60 + secondsPart;
  const normalizedMinutes = Math.floor(totalSeconds / 60);
  const normalizedSeconds = totalSeconds % 60;
  return {
    minutes: normalizedMinutes,
    seconds: normalizedSeconds,
    totalSeconds,
  };
}

export function formatClock(minutes: number, seconds: number): string {
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

export function calculateTargetSeconds(
  sourcePower: number,
  targetPower: number,
  sourceSeconds: number,
): number {
  return Math.round((sourcePower / targetPower) * sourceSeconds);
}
