export interface AppElements {
  presetButtonsContainer: HTMLElement;
  presetButtons: HTMLButtonElement[];
  setupView: HTMLElement;
  calculationView: HTMLElement;
  setupForm: HTMLFormElement;
  setupTargetInput: HTMLInputElement;
  targetPowerValues: HTMLElement[];
  sourcePowerIndicators: HTMLElement[];
  sourceStep: HTMLElement;
  timeStep: HTMLElement;
  resultStep: HTMLElement;
  resultEditSourceButton: HTMLButtonElement;
  manualSourceInput: HTMLInputElement;
  keypad: HTMLElement;
  timePreviewNormalized: HTMLElement;
  timePreviewSeconds: HTMLElement;
  resultDisplay: HTMLElement;
  resultSeconds: HTMLElement;
  errorBanner: HTMLElement;
  timeDigits: HTMLElement[];
}

function expectElement<T extends Element>(element: T | null, selector: string): T {
  if (!element) {
    console.error(`Required element missing for selector: ${selector}`);
    throw new Error(`Required element missing for selector: ${selector}`);
  }
  return element;
}

export function queryAppElements(): AppElements {
  const presetButtonsContainer = expectElement(
    document.querySelector<HTMLElement>(".preset-buttons"),
    ".preset-buttons",
  );

  return {
    presetButtonsContainer,
    presetButtons: Array.from(
      presetButtonsContainer.querySelectorAll<HTMLButtonElement>(".preset-button"),
    ),
    setupView: expectElement(document.getElementById("setup-view"), "#setup-view"),
    calculationView: expectElement(
      document.getElementById("calculation-view"),
      "#calculation-view",
    ),
    setupForm: expectElement(
      document.getElementById("setup-form") as HTMLFormElement | null,
      "#setup-form",
    ),
    setupTargetInput: expectElement(
      document.getElementById("setup-target-input") as HTMLInputElement | null,
      "#setup-target-input",
    ),
    targetPowerValues: Array.from(
      document.querySelectorAll<HTMLElement>("[data-bind='target-power']"),
    ),
    sourcePowerIndicators: Array.from(
      document.querySelectorAll<HTMLElement>("[data-bind='source-power']"),
    ),
    sourceStep: expectElement(document.getElementById("source-step"), "#source-step"),
    timeStep: expectElement(document.getElementById("time-step"), "#time-step"),
    resultStep: expectElement(document.getElementById("result-step"), "#result-step"),
    resultEditSourceButton: expectElement(
      document.getElementById("result-edit-source") as HTMLButtonElement | null,
      "#result-edit-source",
    ),
    manualSourceInput: expectElement(
      document.getElementById("manual-source-input") as HTMLInputElement | null,
      "#manual-source-input",
    ),
    keypad: expectElement(document.querySelector(".keypad"), ".keypad"),
    timePreviewNormalized: expectElement(
      document.getElementById("time-preview-normalized"),
      "#time-preview-normalized",
    ),
    timePreviewSeconds: expectElement(
      document.getElementById("time-preview-seconds"),
      "#time-preview-seconds",
    ),
    resultDisplay: expectElement(document.getElementById("result-display"), "#result-display"),
    resultSeconds: expectElement(document.getElementById("result-seconds"), "#result-seconds"),
    errorBanner: expectElement(document.getElementById("error-banner"), "#error-banner"),
    timeDigits: Array.from(document.querySelectorAll<HTMLElement>(".time-digit")),
  };
}

export function hydratePresetButtons(
  elements: AppElements,
  presetPowers: number[],
): void {
  const fragment = document.createDocumentFragment();
  presetPowers.forEach((power) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "preset-button";
    button.dataset.power = String(power);
    button.textContent = `${power}W`;
    fragment.appendChild(button);
  });

  elements.presetButtonsContainer.innerHTML = "";
  elements.presetButtonsContainer.appendChild(fragment);
  elements.presetButtons = Array.from(
    elements.presetButtonsContainer.querySelectorAll<HTMLButtonElement>(".preset-button"),
  );
}
