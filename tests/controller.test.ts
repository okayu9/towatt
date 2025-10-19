import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { NOTICE_DURATION_MS } from "../src/app/constants";
import { createAppController } from "../src/app/controller";
import { createAppStore, createInitialState } from "../src/app/state";
import type { AppElements } from "../src/app/dom";
import { getActiveLocale, translate } from "../src/app/i18n";

vi.mock("../src/app/analytics", () => ({
  trackCalculationIssue: vi.fn(),
  trackCalculationReset: vi.fn(),
  trackErrorShown: vi.fn(),
  trackKeypadInteraction: vi.fn(),
  trackSourcePowerCleared: vi.fn(),
  trackSourcePowerInvalid: vi.fn(),
  trackSourcePowerSelected: vi.fn(),
  trackTargetPowerConfirmed: vi.fn(),
}));

import * as analytics from "../src/app/analytics";

function createKeypad(): HTMLElement {
  const keypad = document.createElement("div");
  keypad.className = "keypad";
  const keys = ["1", "2", "3", "4", "clear", "back"];
  keys.forEach((key) => {
    const button = document.createElement("button");
    button.dataset.key = key;
    button.type = "button";
    button.textContent = key;
    keypad.appendChild(button);
  });
  return keypad;
}

function createElements(): AppElements {
  const presetButtonsContainer = document.createElement("div");
  presetButtonsContainer.className = "preset-buttons";

  const setupForm = document.createElement("form");
  const setupTargetInput = document.createElement("input");
  setupTargetInput.id = "setup-target-input";
  setupForm.id = "setup-form";
  setupForm.appendChild(setupTargetInput);

  const manualSourceInput = document.createElement("input");
  manualSourceInput.id = "manual-source-input";

  const resultEditSourceButton = document.createElement("button");
  resultEditSourceButton.id = "result-edit-source";

  const errorBanner = document.createElement("section");
  errorBanner.id = "error-banner";
  errorBanner.hidden = true;

  const keypad = createKeypad();

  const elements: AppElements = {
    presetButtonsContainer,
    presetButtons: [],
    setupView: document.createElement("section"),
    calculationView: document.createElement("section"),
    setupForm,
    setupTargetInput,
    targetPowerValues: [document.createElement("span")],
    sourcePowerIndicators: [document.createElement("span")],
    sourceStep: document.createElement("section"),
    timeStep: document.createElement("section"),
    resultStep: document.createElement("section"),
    resultEditSourceButton,
    manualSourceInput,
    keypad,
    timePreviewNormalized: document.createElement("div"),
    timePreviewSeconds: document.createElement("div"),
    resultDisplay: document.createElement("div"),
    resultSeconds: document.createElement("div"),
    errorBanner,
    timeDigits: [0, 1, 2, 3].map(() => document.createElement("span")),
    privacyOpenButton: document.createElement("button"),
    privacyModal: document.createElement("section"),
    privacyModalOverlay: document.createElement("div"),
    privacyModalPanel: document.createElement("div"),
    privacyDismissButtons: [document.createElement("button")],
  };

  document.body.append(
    elements.setupView,
    elements.calculationView,
    elements.presetButtonsContainer,
    elements.setupForm,
    elements.manualSourceInput,
    elements.keypad,
    elements.resultEditSourceButton,
    elements.errorBanner,
    elements.privacyModal,
  );

  return elements;
}

function submitForm(form: HTMLFormElement) {
  const event = new Event("submit", { bubbles: true, cancelable: true });
  const prevented = !form.dispatchEvent(event);
  if (!prevented && !event.defaultPrevented) {
    form.submit();
  }
}

describe("createAppController", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("shows an error when target input is invalid", () => {
    vi.useFakeTimers();
    const store = createAppStore(createInitialState());
    const elements = createElements();
    const render = vi.fn();

    const locale = getActiveLocale();
    const controller = createAppController({ store, elements, render, locale });
    controller.initialize();

    elements.setupTargetInput.value = "50";
    submitForm(elements.setupForm);

    expect(store.getState().targetPower).toBeNull();
    const invalidRange = translate(locale, "errors.invalidRange");
    expect(analytics.trackErrorShown).toHaveBeenCalledWith(invalidRange);
    expect(elements.errorBanner.hidden).toBe(false);
    expect(elements.errorBanner.textContent).toBe(invalidRange);

    vi.advanceTimersByTime(NOTICE_DURATION_MS);
    expect(elements.errorBanner.hidden).toBe(true);
    vi.useRealTimers();
  });

  it("handles the main flow from form submission to result display", () => {
    const store = createAppStore(createInitialState());
    const elements = createElements();
    const render = vi.fn();
    const locale = getActiveLocale();

    const controller = createAppController({ store, elements, render, locale });
    controller.initialize();

    expect(render).toHaveBeenCalledWith(store.getState());

    elements.setupTargetInput.value = "600";
    submitForm(elements.setupForm);

    expect(store.getState().targetPower).toBe(600);
    expect(store.getState().viewMode).toBe("calculation");
    expect(analytics.trackTargetPowerConfirmed).toHaveBeenCalledWith(600, "form");

    const preset500 = elements.presetButtonsContainer.querySelector<HTMLButtonElement>("[data-power='500']");
    expect(preset500).not.toBeNull();
    preset500!.click();

    expect(store.getState().sourcePower).toBe(500);
    expect(store.getState().calculationStep).toBe("time");

    const pressKey = (key: string) => {
      const button = elements.keypad.querySelector<HTMLButtonElement>(`[data-key='${key}']`);
      expect(button).not.toBeNull();
      button!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    };

    pressKey("1");
    pressKey("2");
    pressKey("3");
    pressKey("4");

    expect(store.getState().lastResult).not.toBeNull();
    expect(store.getState().calculationStep).toBe("result");

    elements.resultEditSourceButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(store.getState().calculationStep).toBe("source");
    expect(analytics.trackCalculationReset).toHaveBeenCalledWith("edit-source-button");
  });
});
