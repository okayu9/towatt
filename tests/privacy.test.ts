import { beforeEach, describe, expect, it, vi } from "vitest";

import { initializePrivacyPolicy } from "../src/app/privacy";
import { createAppElementsStub } from "./helpers/elements";

describe("initializePrivacyPolicy", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("opens and closes the modal via button interactions", () => {
    vi.useFakeTimers();
    const elements = createAppElementsStub();
    initializePrivacyPolicy(elements);

    elements.privacyOpenButton.click();
    expect(elements.privacyModal.hidden).toBe(false);
    expect(document.body.classList.contains("privacy-modal-open")).toBe(true);

    vi.runAllTimers();
    expect(document.activeElement).toBe(elements.privacyModalPanel);

    elements.privacyDismissButtons[0].dispatchEvent(new Event("click"));
    expect(elements.privacyModal.hidden).toBe(true);
    expect(document.body.classList.contains("privacy-modal-open")).toBe(false);
    vi.useRealTimers();
  });

  it("closes the modal with the Escape key", () => {
    vi.useFakeTimers();
    const elements = createAppElementsStub();
    initializePrivacyPolicy(elements);
    elements.privacyOpenButton.click();

    const escapeEvent = new KeyboardEvent("keydown", { key: "Escape" });
    window.dispatchEvent(escapeEvent);

    expect(elements.privacyModal.hidden).toBe(true);
    expect(document.body.classList.contains("privacy-modal-open")).toBe(false);
    vi.useRealTimers();
  });

  it("keeps focus trapped inside the modal with Tab navigation", () => {
    vi.useFakeTimers();
    const elements = createAppElementsStub();
    const firstButton = elements.privacyDismissButtons[1] as HTMLButtonElement;
    const additionalButton = document.createElement("button");
    elements.privacyModalPanel.append(additionalButton);

    initializePrivacyPolicy(elements);
    elements.privacyOpenButton.click();
    vi.runAllTimers();

    additionalButton.focus();
    const tabEvent = new KeyboardEvent("keydown", { key: "Tab" });
    elements.privacyModal.dispatchEvent(tabEvent);
    expect(document.activeElement).toBe(firstButton);

    const shiftTabEvent = new KeyboardEvent("keydown", { key: "Tab", shiftKey: true });
    elements.privacyModal.dispatchEvent(shiftTabEvent);
    expect(document.activeElement).toBe(additionalButton);
    vi.useRealTimers();
  });
});
