import { beforeEach, vi } from "vitest";

beforeEach(() => {
  vi.restoreAllMocks();
  window.gtag = undefined;
  window.dataLayer = [];
});
