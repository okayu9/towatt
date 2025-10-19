import { beforeEach, describe, expect, it, vi } from "vitest";

import { POWER_MAX, POWER_MIN } from "../src/app/constants";
import { parseTargetFromQuery, removeTargetParam, updateTargetParam } from "../src/app/routing";

describe("routing", () => {
  const baseUrl = "https://example.com/app";

  beforeEach(() => {
    window.location.href = baseUrl;
  });

  it("parses target query values within range", () => {
    window.location.href = `${baseUrl}?target=${POWER_MIN}`;
    expect(parseTargetFromQuery()).toBe(POWER_MIN);
  });

  it("returns null for invalid values", () => {
    window.location.href = `${baseUrl}?target=${POWER_MAX + 10}`;
    expect(parseTargetFromQuery()).toBeNull();

    window.location.href = `${baseUrl}?target=foo`;
    expect(parseTargetFromQuery()).toBeNull();
  });

  it("updates the URL via updateTargetParam", () => {
    const spy = vi.spyOn(window.history, "replaceState");
    updateTargetParam(600);
    expect(spy).toHaveBeenCalledWith(null, "", `${baseUrl}?target=600`);
    spy.mockRestore();
  });

  it("removes the query parameter via removeTargetParam", () => {
    window.location.href = `${baseUrl}?target=500`;
    const spy = vi.spyOn(window.history, "replaceState");
    removeTargetParam();
    expect(spy).toHaveBeenCalledWith(null, "", `${baseUrl}`);
    spy.mockRestore();
  });
});
