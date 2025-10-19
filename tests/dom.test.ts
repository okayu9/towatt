import { beforeEach, describe, expect, it, vi } from "vitest";

import { hydratePresetButtons, queryAppElements } from "../src/app/dom";
import { PRESET_POWERS } from "../src/app/constants";
import { createAppElementsStub } from "./helpers/elements";

describe("DOM utilities", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("collects required elements via queryAppElements", () => {
    createAppElementsStub();
    const elements = queryAppElements();
    expect(elements.presetButtons).toHaveLength(1);
    expect(elements.timeDigits).toHaveLength(4);
    expect(elements.privacyDismissButtons.length).toBeGreaterThan(0);
  });

  it("rebuilds preset buttons for the provided wattages", () => {
    const elements = createAppElementsStub();
    elements.presetButtonsContainer.innerHTML = "";

    hydratePresetButtons(elements, PRESET_POWERS);

    const buttonLabels = elements.presetButtons.map((button) => button.textContent);
    expect(buttonLabels).toEqual(PRESET_POWERS.map((power) => `${power}W`));
    expect(elements.presetButtons.every((button) => button.type === "button")).toBe(true);
  });

  it("throws when required markup is missing", () => {
    document.body.innerHTML = '<div class="preset-buttons"></div>';
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => queryAppElements()).toThrowError();
    errorSpy.mockRestore();
  });
});
