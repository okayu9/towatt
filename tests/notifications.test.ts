import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createBannerNotifier } from "../src/app/notifications";

describe("createBannerNotifier", () => {
  let element: HTMLElement;

  beforeEach(() => {
    vi.useFakeTimers();
    element = document.createElement("div");
    element.hidden = true;
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("shows message and hides it after the configured duration", () => {
    const notifier = createBannerNotifier(element, 1000);
    notifier.show("Error message");

    expect(element.hidden).toBe(false);
    expect(element.textContent).toBe("Error message");

    vi.advanceTimersByTime(1000);

    expect(element.hidden).toBe(true);
  });

  it("hide clears the timer and hides immediately", () => {
    const notifier = createBannerNotifier(element, 1000);
    notifier.show("Visible");
    notifier.hide();

    expect(element.hidden).toBe(true);
    vi.advanceTimersByTime(1000);
    expect(element.hidden).toBe(true);
  });
});
