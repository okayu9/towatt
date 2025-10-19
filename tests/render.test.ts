import { beforeEach, describe, expect, it } from "vitest";

import { createRenderer } from "../src/app/render";
import { createInitialState } from "../src/app/state";
import type { AppState } from "../src/app/types";
import { createAppElementsStub } from "./helpers/elements";
import { getActiveLocale, translate } from "../src/app/i18n";

describe("createRenderer", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  const locale = getActiveLocale();

  function renderWithState(state: AppState) {
    document.body.innerHTML = "";
    const elements = createAppElementsStub();
    const render = createRenderer(elements, locale);
    render(state);
    return { elements };
  }

  it("toggles views based on the current viewMode", () => {
    const initialState = createInitialState();
    const { elements } = renderWithState(initialState);
    expect(elements.setupView.hidden).toBe(false);
    expect(elements.calculationView.hidden).toBe(true);

    const calcState: AppState = {
      ...initialState,
      viewMode: "calculation",
    };
    const result = renderWithState(calcState);
    expect(result.elements.setupView.hidden).toBe(true);
    expect(result.elements.calculationView.hidden).toBe(false);
  });

  it("syncs displayed wattage and input fields", () => {
    const baseState = createInitialState();
    const state: AppState = {
      ...baseState,
      viewMode: "calculation",
      targetPower: 600,
      sourcePower: 500,
      sourceSelection: "preset",
    };

    const { elements } = renderWithState(state);
    expect(elements.setupTargetInput.value).toBe("600");
    expect(elements.targetPowerValues.every((element) => element.textContent === "600")).toBe(true);
    expect(elements.sourcePowerIndicators[0].textContent).toBe("500");
    expect(elements.presetButtons[0].classList.contains("is-active")).toBe(true);
  });

  it("updates the time input preview and placeholders", () => {
    const baseState = createInitialState();
    const state: AppState = {
      ...baseState,
      viewMode: "calculation",
      rawTimeInput: "12",
    };

    const { elements } = renderWithState(state);
    expect(elements.timeDigits[0].textContent).toBe("1");
    expect(elements.timeDigits[1].textContent).toBe("2");
    expect(elements.timeDigits[2].textContent).toBe("_");
    expect(elements.timeDigits[3].textContent).toBe("\u00A0");
    expect(elements.timePreviewNormalized.textContent).toBe(
      translate(locale, "time.preview.waiting"),
    );

    const filledState: AppState = {
      ...state,
      rawTimeInput: "0130",
    };
    const filled = renderWithState(filledState).elements;
    expect(filled.timePreviewNormalized.textContent).toBe(
      translate(locale, "time.preview.normalized", { minutes: 1, seconds: "30" }),
    );
    expect(filled.timePreviewSeconds.textContent).toBe(
      translate(locale, "time.preview.total", { seconds: 90 }),
    );
  });

  it("renders results in mm:ss format when available", () => {
    const baseState = createInitialState();
    const state: AppState = {
      ...baseState,
      viewMode: "calculation",
      lastResult: {
        targetSeconds: 125,
        sourcePreview: { minutes: 2, seconds: 5, totalSeconds: 125 },
      },
    };

    const { elements } = renderWithState(state);
    expect(elements.resultDisplay.textContent).toBe("02:05");
    expect(elements.resultSeconds.textContent).toBe(
      translate(locale, "result.totalSeconds", { seconds: 125 }),
    );
  });
});
