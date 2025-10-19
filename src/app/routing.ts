import { TARGET_PARAM } from "./constants";
import { isValidPower } from "./logic";

export function parseTargetFromQuery(): number | null {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get(TARGET_PARAM);
  if (!raw) {
    return null;
  }
  const value = Number(raw);
  return isValidPower(value) ? value : null;
}

export function removeTargetParam(): void {
  const url = new URL(window.location.href);
  if (!url.searchParams.has(TARGET_PARAM)) {
    return;
  }
  url.searchParams.delete(TARGET_PARAM);
  window.history.replaceState(null, "", url.toString());
}

export function updateTargetParam(value: number): void {
  const url = new URL(window.location.href);
  url.searchParams.set(TARGET_PARAM, String(value));
  window.history.replaceState(null, "", url.toString());
}
