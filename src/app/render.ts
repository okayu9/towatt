import { TIME_DIGITS } from "./constants";
import type { AppElements } from "./dom";
import { formatClock, parseRawTime } from "./logic";
import type { AppState } from "./types";
import { translate, type LocaleDictionary } from "./i18n";

const NBSP = "\u00A0";

export function createRenderer(elements: AppElements, locale: LocaleDictionary) {
  return function render(state: AppState): void {
    renderViews(state);
    renderTargetState(state);
    renderSourceState(state);
    renderTimeState(state);
    renderResultState(state);
    renderCalculationStep(state);
  };

  function renderViews(state: AppState): void {
    elements.setupView.hidden = state.viewMode !== "setup";
    elements.calculationView.hidden = state.viewMode !== "calculation";
  }

  function renderTargetState(state: AppState): void {
    if (state.targetPower !== null) {
      elements.setupTargetInput.value = String(state.targetPower);
    }

    const label = state.targetPower === null ? "---" : String(state.targetPower);
    elements.targetPowerValues.forEach((element) => {
      element.textContent = label;
    });
  }

  function renderSourceState(state: AppState): void {
    elements.presetButtons.forEach((button) => {
      const power = Number(button.dataset.power ?? "");
      const isActive =
        state.sourceSelection === "preset" && state.sourcePower === power;
      button.classList.toggle("is-active", isActive);
    });

    elements.manualSourceInput.value = state.manualSourceDraft;

    const indicatorLabel = state.sourcePower === null ? "---" : String(state.sourcePower);
    elements.sourcePowerIndicators.forEach((element) => {
      element.textContent = indicatorLabel;
    });
  }

  function renderTimeState(state: AppState): void {
    const activeIndex =
      state.rawTimeInput.length < TIME_DIGITS ? state.rawTimeInput.length : -1;

    elements.timeDigits.forEach((digitElement, index) => {
      const filledChar = state.rawTimeInput.charAt(index);
      const isFilled = filledChar !== "";
      const isActive = index === activeIndex;
      const displayChar = isFilled ? filledChar : isActive ? "_" : NBSP;
      digitElement.textContent = displayChar;
      digitElement.classList.toggle("is-active", isActive);
      digitElement.classList.toggle("is-empty", !isFilled);
    });

    if (state.rawTimeInput.length === TIME_DIGITS) {
      const preview = parseRawTime(state.rawTimeInput);
      const secondsText = preview.seconds.toString().padStart(2, "0");
      elements.timePreviewNormalized.textContent = translate(locale, "time.preview.normalized", {
        minutes: preview.minutes,
        seconds: secondsText,
      });
      elements.timePreviewSeconds.textContent = translate(locale, "time.preview.total", {
        seconds: preview.totalSeconds,
      });
    } else {
      elements.timePreviewNormalized.textContent = translate(locale, "time.preview.waiting");
      elements.timePreviewSeconds.textContent = "";
    }
  }

  function renderResultState(state: AppState): void {
    if (!state.lastResult) {
      elements.resultDisplay.textContent = translate(locale, "result.pending");
      elements.resultSeconds.textContent = "";
      return;
    }

    const minutes = Math.floor(state.lastResult.targetSeconds / 60);
    const seconds = state.lastResult.targetSeconds % 60;
    elements.resultDisplay.textContent = formatClock(minutes, seconds);
    elements.resultSeconds.textContent = translate(locale, "result.totalSeconds", {
      seconds: state.lastResult.targetSeconds,
    });
  }

  function renderCalculationStep(state: AppState): void {
    elements.sourceStep.hidden = state.calculationStep !== "source";
    elements.timeStep.hidden = state.calculationStep !== "time";
    elements.resultStep.hidden = state.calculationStep !== "result";
  }

}
