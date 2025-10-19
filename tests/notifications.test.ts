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

  it("show でメッセージを表示し一定時間後に隠す", () => {
    const notifier = createBannerNotifier(element, 1000);
    notifier.show("エラーです");

    expect(element.hidden).toBe(false);
    expect(element.textContent).toBe("エラーです");

    vi.advanceTimersByTime(1000);

    expect(element.hidden).toBe(true);
  });

  it("hide でタイマーをクリアして即座に非表示にする", () => {
    const notifier = createBannerNotifier(element, 1000);
    notifier.show("表示");
    notifier.hide();

    expect(element.hidden).toBe(true);
    vi.advanceTimersByTime(1000);
    expect(element.hidden).toBe(true);
  });
});
