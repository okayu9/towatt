import type { AppElements } from "../../src/app/dom";

export function createAppElementsStub(): AppElements {
  const presetButtonsContainer = document.createElement("div");
  presetButtonsContainer.className = "preset-buttons";

  const presetButton = document.createElement("button");
  presetButton.className = "preset-button";
  presetButton.dataset.power = "500";
  presetButton.type = "button";
  presetButton.textContent = "500W";
  presetButtonsContainer.appendChild(presetButton);

  const setupView = document.createElement("section");
  setupView.id = "setup-view";

  const calculationView = document.createElement("section");
  calculationView.id = "calculation-view";

  const setupForm = document.createElement("form");
  setupForm.id = "setup-form";

  const setupTargetInput = document.createElement("input");
  setupTargetInput.id = "setup-target-input";
  setupForm.appendChild(setupTargetInput);

  const manualSourceInput = document.createElement("input");
  manualSourceInput.id = "manual-source-input";

  const sourceStep = document.createElement("section");
  sourceStep.id = "source-step";

  const timeStep = document.createElement("section");
  timeStep.id = "time-step";

  const resultStep = document.createElement("section");
  resultStep.id = "result-step";

  const resultEditSourceButton = document.createElement("button");
  resultEditSourceButton.id = "result-edit-source";
  resultEditSourceButton.type = "button";

  const keypad = document.createElement("div");
  keypad.className = "keypad";

  const timePreviewNormalized = document.createElement("div");
  timePreviewNormalized.id = "time-preview-normalized";

  const timePreviewSeconds = document.createElement("div");
  timePreviewSeconds.id = "time-preview-seconds";

  const resultDisplay = document.createElement("p");
  resultDisplay.id = "result-display";

  const resultSeconds = document.createElement("p");
  resultSeconds.id = "result-seconds";

  const errorBanner = document.createElement("section");
  errorBanner.id = "error-banner";
  errorBanner.hidden = true;

  const privacyOpenButton = document.createElement("button");
  privacyOpenButton.id = "privacy-open";
  privacyOpenButton.type = "button";

  const privacyModal = document.createElement("section");
  privacyModal.id = "privacy-modal";
  privacyModal.hidden = true;
  privacyModal.setAttribute("aria-hidden", "true");

  const privacyModalOverlay = document.createElement("div");
  privacyModalOverlay.className = "privacy-modal__overlay";
  privacyModalOverlay.dataset.privacyDismiss = "overlay";

  const privacyModalPanel = document.createElement("div");
  privacyModalPanel.className = "privacy-modal__panel";
  privacyModalPanel.tabIndex = -1;

  const privacyDismissButton = document.createElement("button");
  privacyDismissButton.dataset.privacyDismiss = "dismiss";
  privacyDismissButton.type = "button";

  privacyModalPanel.appendChild(privacyDismissButton);
  privacyModal.append(privacyModalOverlay, privacyModalPanel);

  const targetPowerValues = [document.createElement("span"), document.createElement("span")];
  const sourcePowerIndicators = [document.createElement("span")];

  const timeDigits = Array.from({ length: 4 }, () => {
    const span = document.createElement("span");
    span.className = "time-digit";
    return span;
  });

  document.body.append(
    setupView,
    calculationView,
    presetButtonsContainer,
    setupForm,
    manualSourceInput,
    keypad,
    sourceStep,
    timeStep,
    resultStep,
    timePreviewNormalized,
    timePreviewSeconds,
    resultDisplay,
    resultSeconds,
    resultEditSourceButton,
    errorBanner,
    privacyOpenButton,
    privacyModal,
  );

  timeDigits.forEach((digit) => document.body.appendChild(digit));
  targetPowerValues.forEach((element) => document.body.appendChild(element));
  sourcePowerIndicators.forEach((element) => document.body.appendChild(element));

  return {
    presetButtonsContainer,
    presetButtons: Array.from(
      presetButtonsContainer.querySelectorAll<HTMLButtonElement>(".preset-button"),
    ),
    setupView,
    calculationView,
    setupForm: setupForm as HTMLFormElement,
    setupTargetInput: setupTargetInput as HTMLInputElement,
    targetPowerValues,
    sourcePowerIndicators,
    sourceStep,
    timeStep,
    resultStep,
    resultEditSourceButton: resultEditSourceButton as HTMLButtonElement,
    manualSourceInput: manualSourceInput as HTMLInputElement,
    keypad,
    timePreviewNormalized,
    timePreviewSeconds,
    resultDisplay,
    resultSeconds,
    errorBanner,
    timeDigits,
    privacyOpenButton: privacyOpenButton as HTMLButtonElement,
    privacyModal,
    privacyModalOverlay,
    privacyModalPanel,
    privacyDismissButtons: [privacyModalOverlay, privacyDismissButton],
  } satisfies AppElements;
}

