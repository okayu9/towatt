(() => {
  type ViewMode = "setup" | "calculation";
  type SourceSelection = "preset" | "manual" | null;

  const TARGET_PARAM = "target";
  const POWER_MIN = 100;
  const POWER_MAX = 3000;
  const TIME_DIGITS = 4;
  const NOTICE_DURATION_MS = 5000;

  interface AppState {
    targetPower: number | null;
    sourcePower: number | null;
    rawTimeInput: string;
    viewMode: ViewMode;
    sourceSelection: SourceSelection;
    bookmarkTimer: number | null;
    errorTimer: number | null;
    lastScrollToken: string | null;
  }

  const state: AppState = {
    targetPower: null,
    sourcePower: null,
    rawTimeInput: "",
    viewMode: "setup",
    sourceSelection: null,
    bookmarkTimer: null,
    errorTimer: null,
    lastScrollToken: null,
  };

  const presetButtons = Array.from(
    document.querySelectorAll<HTMLButtonElement>(".preset-button")
  );

  const elements = {
    setupView: document.getElementById("setup-view") as HTMLElement,
    calculationView: document.getElementById("calculation-view") as HTMLElement,
    setupForm: document.getElementById("setup-form") as HTMLFormElement,
    setupTargetInput: document.getElementById("setup-target-input") as HTMLInputElement,
    bookmarkToast: document.getElementById("bookmark-toast") as HTMLElement,
    bookmarkUrlValue: document.getElementById("bookmark-url-value") as HTMLElement,
    targetPowerValue: document.getElementById("target-power-value") as HTMLElement,
    manualSourceInput: document.getElementById("manual-source-input") as HTMLInputElement,
    timeDisplay: document.getElementById("time-display") as HTMLElement,
    timeGuidance: document.getElementById("time-guidance") as HTMLElement,
    timePreviewNormalized: document.getElementById("time-preview-normalized") as HTMLElement,
    timePreviewSeconds: document.getElementById("time-preview-seconds") as HTMLElement,
    keypad: document.querySelector(".keypad") as HTMLElement,
    resultDisplay: document.getElementById("result-display") as HTMLElement,
    resultSeconds: document.getElementById("result-seconds") as HTMLElement,
    resultSection: document.getElementById("result-section") as HTMLElement,
    errorBanner: document.getElementById("error-banner") as HTMLElement,
  } as const;

  function init(): void {
    const initialTarget = parseTargetFromQuery();
    if (initialTarget !== null) {
      state.targetPower = initialTarget;
      state.viewMode = "calculation";
    } else {
      state.viewMode = "setup";
      removeInvalidTargetParam();
    }

    reflectTargetInput();
    attachEventListeners();
    renderAll();
  }

  function parseTargetFromQuery(): number | null {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get(TARGET_PARAM);
    if (!raw) {
      return null;
    }
    const value = Number(raw);
    return isValidPower(value) ? value : null;
  }

  function removeInvalidTargetParam(): void {
    const url = new URL(window.location.href);
    if (!url.searchParams.has(TARGET_PARAM)) {
      return;
    }
    url.searchParams.delete(TARGET_PARAM);
    window.history.replaceState(null, "", url.toString());
  }

  function attachEventListeners(): void {
    elements.setupForm.addEventListener("submit", handleSetupSubmit);
    presetButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const power = Number(button.dataset.power ?? "");
        if (!isValidPower(power)) {
          return;
        }
        state.sourceSelection = "preset";
        setSourcePower(power);
      });
    });
    elements.manualSourceInput.addEventListener("input", handleManualSourceInput);
    elements.keypad.addEventListener("click", handleKeypadClick);
  }

  function handleSetupSubmit(event: Event): void {
    event.preventDefault();
    const value = Number(elements.setupTargetInput.value.trim());
    if (!isValidPower(value)) {
      showError("ワット数は100〜3000の範囲で指定してください");
      return;
    }
    state.targetPower = value;
    state.viewMode = "calculation";
    updateTargetUrl(value);
    renderAll();
    showBookmarkNotice();
  }

  function updateTargetUrl(value: number): void {
    const url = new URL(window.location.href);
    url.searchParams.set(TARGET_PARAM, String(value));
    window.history.replaceState(null, "", url.toString());
  }

  function reflectTargetInput(): void {
    if (state.targetPower !== null) {
      elements.setupTargetInput.value = String(state.targetPower);
    }
  }

  function setSourcePower(power: number | null): void {
    state.sourcePower = power;
    renderSourcePowerSection();
    attemptCalculation();
  }

  function handleManualSourceInput(event: Event): void {
    const input = event.currentTarget as HTMLInputElement;
    const trimmed = input.value.trim();
    state.sourceSelection = trimmed === "" ? null : "manual";

    if (trimmed === "") {
      state.sourcePower = null;
      renderSourcePowerSection();
      renderResultSection();
      return;
    }

    const value = Number(trimmed);
    if (!isValidPower(value)) {
      state.sourcePower = null;
      renderSourcePowerSection();
      showError("ワット数は100〜3000の範囲で指定してください");
      return;
    }

    state.sourcePower = value;
    renderSourcePowerSection();
    attemptCalculation();
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
      clearRawInput();
      return;
    }
    if (key === "back") {
      removeLastDigit();
      return;
    }
    if (/^\d$/.test(key)) {
      appendDigit(key);
    }
  }

  function clearRawInput(): void {
    state.rawTimeInput = "";
    state.lastScrollToken = null;
    renderTimeSection();
    renderResultSection();
  }

  function removeLastDigit(): void {
    if (state.rawTimeInput.length === 0) {
      return;
    }
    state.rawTimeInput = state.rawTimeInput.slice(0, -1);
    state.lastScrollToken = null;
    renderTimeSection();
    renderResultSection();
  }

  function appendDigit(digit: string): void {
    if (state.rawTimeInput.length >= TIME_DIGITS) {
      return;
    }
    state.rawTimeInput += digit;
    renderTimeSection();
    if (state.rawTimeInput.length === TIME_DIGITS) {
      attemptCalculation({ scrollResult: true });
    } else {
      renderResultSection();
    }
  }

  function attemptCalculation(options?: { scrollResult?: boolean }): void {
    if (state.rawTimeInput.length !== TIME_DIGITS) {
      renderResultSection();
      return;
    }
    if (state.sourcePower === null || state.targetPower === null) {
      renderResultSection();
      showError("ワット数と時間を入力してください");
      return;
    }

    const sourceTime = parseRawTime(state.rawTimeInput);
    if (sourceTime.totalSeconds <= 0) {
      renderResultSection();
      showError("加熱時間は1秒以上で指定してください");
      return;
    }

    const ratio = state.sourcePower / state.targetPower;
    const targetSeconds = Math.round(ratio * sourceTime.totalSeconds);
    if (targetSeconds <= 0) {
      renderResultSection();
      showError("加熱時間は1秒以上で指定してください");
      return;
    }

    renderResultSection({ targetSeconds, sourcePreview: sourceTime });

    if (options?.scrollResult) {
      const token = `${state.sourcePower}-${state.targetPower}-${state.rawTimeInput}`;
      if (state.lastScrollToken !== token) {
        elements.resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
        state.lastScrollToken = token;
      }
    }
  }

  function parseRawTime(raw: string): {
    minutes: number;
    seconds: number;
    totalSeconds: number;
  } {
    const padded = raw.padStart(TIME_DIGITS, "0");
    const minutesPart = Number(padded.slice(0, 2));
    const secondsPart = Number(padded.slice(2, 4));
    const totalSeconds = minutesPart * 60 + secondsPart;
    const normalizedMinutes = Math.floor(totalSeconds / 60);
    const normalizedSeconds = totalSeconds % 60;
    return {
      minutes: normalizedMinutes,
      seconds: normalizedSeconds,
      totalSeconds,
    };
  }

  function renderAll(): void {
    toggleViews();
    renderTargetSection();
    renderSourcePowerSection();
    renderTimeSection();
    renderResultSection();
  }

  function toggleViews(): void {
    elements.setupView.hidden = state.viewMode !== "setup";
    elements.calculationView.hidden = state.viewMode !== "calculation";
  }

  function renderTargetSection(): void {
    if (state.targetPower === null) {
      elements.targetPowerValue.textContent = "---";
      elements.bookmarkUrlValue.textContent = "?target=";
      return;
    }
    elements.targetPowerValue.textContent = String(state.targetPower);
    elements.bookmarkUrlValue.textContent = `?${TARGET_PARAM}=${state.targetPower}`;
  }

  function renderSourcePowerSection(): void {
    presetButtons.forEach((button) => {
      const power = Number(button.dataset.power ?? "");
      const isActive = state.sourceSelection === "preset" && state.sourcePower === power;
      button.classList.toggle("is-active", isActive);
    });

    if (state.sourceSelection === "preset") {
      elements.manualSourceInput.value = "";
    }
  }

  function renderTimeSection(): void {
    const padded = state.rawTimeInput.padStart(TIME_DIGITS, "0");
    const minutesPart = padded.slice(0, 2);
    const secondsPart = padded.slice(2, 4);
    elements.timeDisplay.textContent = `${minutesPart}:${secondsPart}`;

    if (state.rawTimeInput.length === TIME_DIGITS) {
      const preview = parseRawTime(state.rawTimeInput);
      elements.timePreviewNormalized.textContent = `正規化: ${preview.minutes}分${preview.seconds
        .toString()
        .padStart(2, "0")}秒`;
      elements.timePreviewSeconds.textContent = `合計 ${preview.totalSeconds}秒`;
      elements.timeGuidance.textContent = "換算結果を表示しています";
    } else {
      const remaining = TIME_DIGITS - state.rawTimeInput.length;
      elements.timePreviewNormalized.textContent = "入力待ち";
      elements.timePreviewSeconds.textContent = "";
      elements.timeGuidance.textContent = `あと${remaining}桁入力してください (例: 0130)`;
    }
  }

  function renderResultSection(result?: {
    targetSeconds: number;
    sourcePreview: { minutes: number; seconds: number; totalSeconds: number };
  }): void {
    if (!result) {
      elements.resultDisplay.textContent = "結果待ち";
      elements.resultSeconds.textContent = "";
      return;
    }
    const minutes = Math.floor(result.targetSeconds / 60);
    const seconds = result.targetSeconds % 60;
    const formattedTarget = formatClock(minutes, seconds);
    elements.resultDisplay.textContent = `目安: ${formattedTarget}`;
    elements.resultSeconds.textContent = `合計 ${result.targetSeconds}秒 (${formatClock(
      result.sourcePreview.minutes,
      result.sourcePreview.seconds
    )} → ${formattedTarget})`;
  }

  function formatClock(minutes: number, seconds: number): string {
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  function showError(message: string): void {
    if (state.errorTimer !== null) {
      window.clearTimeout(state.errorTimer);
    }
    elements.errorBanner.textContent = message;
    elements.errorBanner.hidden = false;
    state.errorTimer = window.setTimeout(() => {
      elements.errorBanner.hidden = true;
      state.errorTimer = null;
    }, NOTICE_DURATION_MS);
  }

  function showBookmarkNotice(): void {
    if (state.bookmarkTimer !== null) {
      window.clearTimeout(state.bookmarkTimer);
    }
    elements.bookmarkToast.hidden = false;
    state.bookmarkTimer = window.setTimeout(() => {
      elements.bookmarkToast.hidden = true;
      state.bookmarkTimer = null;
    }, NOTICE_DURATION_MS);
  }

  function isValidPower(value: number): boolean {
    return Number.isInteger(value) && value >= POWER_MIN && value <= POWER_MAX;
  }

  document.addEventListener("DOMContentLoaded", init);
})();
