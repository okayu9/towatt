import { NOTICE_DURATION_MS, PRESET_POWERS } from "./constants";
import { createStateActions, type CalculationIssue } from "./actions";
import { AppElements, hydratePresetButtons } from "./dom";
import { isValidPower } from "./logic";
import { createBannerNotifier } from "./notifications";
import { parseTargetFromQuery, removeTargetParam, updateTargetParam } from "./routing";
import type { AppStore } from "./state";
import type { AppState } from "./types";

interface ControllerDeps {
  store: AppStore;
  elements: AppElements;
  render: (state: AppState) => void;
}

export function createAppController({ store, elements, render }: ControllerDeps) {
  
  hydratePresetButtons(elements, PRESET_POWERS);
  store.subscribe(render);

  const actions = createStateActions(store);
  const errorNotifier = createBannerNotifier(elements.errorBanner, NOTICE_DURATION_MS);

  function showError(message: string): void {
    errorNotifier.show(message);
  }

  function handleCalculationIssue(issue: CalculationIssue | null): void {
    if (!issue) {
      return;
    }
    if (issue === "missing-input") {
      showError("ワット数と時間を入力してください");
      return;
    }
    showError("加熱時間は1秒以上で指定してください");
  }

  function focusManualSourceInput(): void {
    window.setTimeout(() => {
      elements.manualSourceInput.focus();
      elements.manualSourceInput.select();
    }, 0);
  }

  function initializeFromUrl(): void {
    const initialTarget = parseTargetFromQuery();
    if (initialTarget !== null) {
      actions.initializeFromTarget(initialTarget);
      return;
    }
    removeTargetParam();
  }

  function handleSetupSubmit(event: Event): void {
    event.preventDefault();
    const trimmed = elements.setupTargetInput.value.trim();
    const value = Number(trimmed);
    if (!isValidPower(value)) {
      showError("ワット数は100〜3000の範囲で指定してください");
      return;
    }
    actions.setTargetPower(value);
    updateTargetParam(value);
  }

  function handlePresetButtonClick(button: HTMLButtonElement): void {
    const power = Number(button.dataset.power ?? "");
    if (!Number.isInteger(power) || !PRESET_POWERS.includes(power) || !isValidPower(power)) {
      return;
    }
    actions.setSourceSelection("preset");
    actions.setManualSourceDraft("");
    const result = actions.setSourcePower(power);
    handleCalculationIssue(result.issue);
  }

  function handlePresetButtonsContainerClick(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!target) {
      return;
    }
    const button = target.closest<HTMLButtonElement>(".preset-button");
    if (!button || !elements.presetButtonsContainer.contains(button)) {
      return;
    }
    handlePresetButtonClick(button);
  }

  function handleManualSourceInput(event: Event): void {
    const input = event.currentTarget as HTMLInputElement;
    const value = input.value;
    const trimmed = value.trim();
    actions.setManualSourceDraft(value);

    if (trimmed === "") {
      actions.setSourceSelection(null);
      actions.setSourcePower(null, { autoAdvance: false });
      return;
    }

    const numericValue = Number(trimmed);
    if (!Number.isFinite(numericValue)) {
      actions.setSourceSelection("manual");
      return;
    }

    actions.setSourceSelection("manual");

    if (!isValidPower(numericValue)) {
      return;
    }

    actions.setSourcePower(numericValue, { autoAdvance: false });
  }

  function handleManualSourceCommit(): void {
    const value = elements.manualSourceInput.value;
    const trimmed = value.trim();

    if (trimmed === "") {
      actions.setManualSourceDraft("");
      actions.setSourceSelection(null);
      actions.setSourcePower(null);
      actions.clearRawInput();
      return;
    }

    const numericValue = Number(trimmed);
    if (!Number.isFinite(numericValue) || !isValidPower(numericValue)) {
      showError("ワット数は100〜3000の範囲で指定してください");
      focusManualSourceInput();
      return;
    }

    actions.setManualSourceDraft(trimmed);
    actions.setSourceSelection("manual");
    const result = actions.setSourcePower(numericValue);
    handleCalculationIssue(result.issue);
  }

  function handleManualSourceKeydown(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      event.preventDefault();
      handleManualSourceCommit();
    }
  }

  function handleKeypadClick(event: MouseEvent): void {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const key = target.dataset.key;
    if (!key) {
      return;
    }
    if (key === "clear") {
      actions.clearRawInput();
      return;
    }
    if (key === "back") {
      actions.removeLastDigit();
      return;
    }
    if (/^\d$/.test(key)) {
      const issue = actions.appendDigit(key);
      handleCalculationIssue(issue);
    }
  }

  function attachEventListeners(): void {
    elements.setupForm.addEventListener("submit", handleSetupSubmit);
    elements.presetButtonsContainer.addEventListener(
      "click",
      handlePresetButtonsContainerClick,
    );
    elements.manualSourceInput.addEventListener("input", handleManualSourceInput);
    elements.manualSourceInput.addEventListener("blur", handleManualSourceCommit);
    elements.manualSourceInput.addEventListener("keydown", handleManualSourceKeydown);
    elements.keypad.addEventListener("click", handleKeypadClick);
    elements.resultEditSourceButton.addEventListener("click", () => {
      actions.resetToSourceSelection();
    });
  }

  function initialize(): void {
    render(store.getState());
    initializeFromUrl();
    attachEventListeners();
  }

  return {
    initialize,
  };
}
