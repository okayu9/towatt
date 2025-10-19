import { beforeEach, describe, expect, it, vi } from "vitest";

import { POWER_MAX, POWER_MIN } from "../src/app/constants";
import { parseTargetFromQuery, removeTargetParam, updateTargetParam } from "../src/app/routing";

describe("routing", () => {
  const baseUrl = "https://example.com/app";

  beforeEach(() => {
    window.location.href = baseUrl;
  });

  it("範囲内の target クエリを解析する", () => {
    window.location.href = `${baseUrl}?target=${POWER_MIN}`;
    expect(parseTargetFromQuery()).toBe(POWER_MIN);
  });

  it("不正値は null を返す", () => {
    window.location.href = `${baseUrl}?target=${POWER_MAX + 10}`;
    expect(parseTargetFromQuery()).toBeNull();

    window.location.href = `${baseUrl}?target=foo`;
    expect(parseTargetFromQuery()).toBeNull();
  });

  it("updateTargetParam で URL を置換する", () => {
    const spy = vi.spyOn(window.history, "replaceState");
    updateTargetParam(600);
    expect(spy).toHaveBeenCalledWith(null, "", `${baseUrl}?target=600`);
    spy.mockRestore();
  });

  it("removeTargetParam でクエリを削除する", () => {
    window.location.href = `${baseUrl}?target=500`;
    const spy = vi.spyOn(window.history, "replaceState");
    removeTargetParam();
    expect(spy).toHaveBeenCalledWith(null, "", `${baseUrl}`);
    spy.mockRestore();
  });
});
