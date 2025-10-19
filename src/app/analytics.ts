import type { AppStore } from "./state";
import type { AppState, CalculationStep, SourceSelection, ViewMode } from "./types";

type KeypadAction = "digit" | "clear" | "backspace";

type TargetSource = "form" | "url-param";

type SourceMethod = "preset" | "manual";

type CalculationIssueType = "missing-input" | "non-positive";

type AnalyticsParams = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function sanitizeParams(params: AnalyticsParams): AnalyticsParams {
  const sanitized: AnalyticsParams = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }
    if (typeof value === "object") {
      if (Array.isArray(value)) {
        sanitized[key] = value.join(",");
        return;
      }
      sanitized[key] = String(value);
      return;
    }
    sanitized[key] = value;
  });
  return sanitized;
}

export function trackEvent(eventName: string, params: AnalyticsParams = {}): void {
  if (typeof window === "undefined") {
    return;
  }

  const sanitized = sanitizeParams(params);
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, sanitized);
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...sanitized });
}

export function trackTargetPowerConfirmed(value: number, source: TargetSource): void {
  trackEvent("target_power_set", {
    target_power: value,
    source,
  });
}

export function trackSourcePowerSelected(
  method: SourceMethod,
  value: number,
  changed: boolean,
): void {
  trackEvent("source_power_selected", {
    method,
    source_power: value,
    changed,
  });
}

export function trackSourcePowerCleared(reason: string): void {
  trackEvent("source_power_cleared", { reason });
}

export function trackSourcePowerInvalid(reason: string): void {
  trackEvent("source_power_invalid", { reason });
}

export function trackKeypadInteraction(action: KeypadAction, detail: string): void {
  trackEvent("keypad_interaction", {
    action,
    detail,
  });
}

export function trackCalculationIssue(issue: CalculationIssueType): void {
  trackEvent("calculation_issue", { issue });
}

export function trackCalculationReset(trigger: string): void {
  trackEvent("calculation_reset", { trigger });
}

export function trackErrorShown(message: string): void {
  trackEvent("ui_error_shown", { message });
}

export function trackSourceSelectionChange(selection: SourceSelection): void {
  trackEvent("source_selection_changed", { selection: selection ?? "none" });
}

export function trackPrivacyModal(action: "open" | "close", reason?: string): void {
  trackEvent("privacy_modal", {
    action,
    reason,
  });
}

export function initializeAnalyticsTracking(store: AppStore): void {
  let previous: AppState | null = null;

  store.subscribe((state) => {
    if (previous === null) {
      emitInitialSnapshots(state);
      previous = state;
      return;
    }

    if (state.viewMode !== previous.viewMode) {
      trackViewModeChange(state.viewMode);
    }

    if (state.calculationStep !== previous.calculationStep) {
      trackCalculationStepChange(state.calculationStep, state.viewMode);
    }

    if (state.sourceSelection !== previous.sourceSelection) {
      trackSourceSelectionChange(state.sourceSelection);
    }

    if (state.lastResult !== previous.lastResult && state.lastResult) {
      trackEvent("calculation_completed", {
        target_power: state.targetPower,
        source_power: state.sourcePower,
        source_seconds: state.lastResult.sourcePreview.totalSeconds,
        target_seconds: state.lastResult.targetSeconds,
      });
    }

    if (state.rawTimeInput !== previous.rawTimeInput) {
      const diff = state.rawTimeInput.length - previous.rawTimeInput.length;
      trackEvent("time_input_updated", {
        length: state.rawTimeInput.length,
        delta: diff,
      });
    }

    previous = state;
  });
}

function emitInitialSnapshots(state: AppState): void {
  trackViewModeChange(state.viewMode);
  trackCalculationStepChange(state.calculationStep, state.viewMode);
  trackSourceSelectionChange(state.sourceSelection);
}

function trackViewModeChange(viewMode: ViewMode): void {
  trackEvent("view_mode_changed", { view_mode: viewMode });
}

function trackCalculationStepChange(step: CalculationStep, viewMode: ViewMode): void {
  trackEvent("calculation_step_changed", {
    step,
    view_mode: viewMode,
  });
}
