import { beforeEach, describe, expect, it, vi } from "vitest";

import * as analytics from "../src/app/analytics";
import { createAppStore, createInitialState } from "../src/app/state";

describe("analytics", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.gtag = undefined;
    window.dataLayer = [];
  });

  it("sends events via gtag when available", () => {
    const gtagMock = vi.fn();
    window.gtag = gtagMock as unknown as typeof window.gtag;

    analytics.trackEvent("test_event", { value: 1, list: ["a", "b"] });

    expect(gtagMock).toHaveBeenCalledWith("event", "test_event", {
      value: 1,
      list: "a,b",
    });
  });

  it("pushes events to dataLayer when gtag is unavailable", () => {
    analytics.trackEvent("fallback", { detail: "ok" });
    expect(window.dataLayer).toEqual([{ event: "fallback", detail: "ok" }]);
  });

  it("tracks store state changes", () => {
    const gtagMock = vi.fn();
    window.gtag = gtagMock as unknown as typeof window.gtag;
    const store = createAppStore(createInitialState());

    analytics.initializeAnalyticsTracking(store);
    store.setState({ ...store.getState() });
    expect(gtagMock).toHaveBeenCalledWith("event", "view_mode_changed", { view_mode: "setup" });

    gtagMock.mockClear();
    store.setState({ ...store.getState(), viewMode: "calculation" });
    expect(gtagMock).toHaveBeenCalledWith("event", "view_mode_changed", { view_mode: "calculation" });

    gtagMock.mockClear();
    store.setState({ ...store.getState(), rawTimeInput: "1" });
    expect(gtagMock).toHaveBeenCalledWith("event", "time_input_updated", { length: 1, delta: 1 });
  });
});
