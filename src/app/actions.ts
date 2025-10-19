import { TIME_DIGITS } from "./constants";
import { calculateTargetSeconds, parseRawTime } from "./logic";
import type { AppStore } from "./state";
import type {
  AppState,
  CalculationResult,
  CalculationStep,
  SourceSelection,
} from "./types";

export type CalculationIssue = "missing-input" | "non-positive";

interface TransactionOutcome {
  nextState: AppState;
  issue?: CalculationIssue | null;
  hasChanged?: boolean;
}

function patchState(state: AppState, updates: Partial<AppState>): AppState {
  if (Object.keys(updates).length === 0) {
    return state;
  }
  return { ...state, ...updates };
}

function ensureResultCleared(state: AppState): AppState {
  if (state.lastResult === null) {
    return state;
  }
  return patchState(state, { lastResult: null });
}

function finalizeCalculation(state: AppState, result: CalculationResult): AppState {
  const nextStep =
    state.viewMode === "calculation" && state.calculationStep !== "result"
      ? "result"
      : state.calculationStep;
  return patchState(state, {
    lastResult: result,
    calculationStep: nextStep,
  });
}

function evaluateCalculation(state: AppState): TransactionOutcome {
  if (state.rawTimeInput.length !== TIME_DIGITS) {
    return { nextState: ensureResultCleared(state), issue: null };
  }
  if (state.sourcePower === null || state.targetPower === null) {
    return { nextState: ensureResultCleared(state), issue: "missing-input" };
  }

  const sourceTime = parseRawTime(state.rawTimeInput);
  if (sourceTime.totalSeconds <= 0) {
    return { nextState: ensureResultCleared(state), issue: "non-positive" };
  }

  const targetSeconds = calculateTargetSeconds(
    state.sourcePower,
    state.targetPower,
    sourceTime.totalSeconds,
  );

  if (targetSeconds <= 0) {
    return { nextState: ensureResultCleared(state), issue: "non-positive" };
  }

  const result: CalculationResult = {
    targetSeconds,
    sourcePreview: sourceTime,
  };

  return { nextState: finalizeCalculation(state, result), issue: null };
}

function runTransaction(
  store: AppStore,
  mutator: (state: AppState) => TransactionOutcome,
): TransactionOutcome {
  let outcome: TransactionOutcome = { nextState: store.getState() };
  store.batchUpdate((state) => {
    outcome = mutator(state);
    return outcome.nextState;
  });
  return outcome;
}

export function createStateActions(store: AppStore) {
  function goToStep(step: CalculationStep): void {
    runTransaction(store, (state) => {
      if (state.viewMode !== "calculation" || state.calculationStep === step) {
        return { nextState: state };
      }
      return { nextState: patchState(state, { calculationStep: step }) };
    });
  }

  function setTargetPower(value: number): void {
    runTransaction(store, (state) => ({
      nextState: patchState(state, {
        targetPower: value,
        viewMode: "calculation",
        calculationStep: "source",
        sourcePower: null,
        sourceSelection: null,
        manualSourceDraft: "",
        rawTimeInput: "",
        lastResult: null,
      }),
    }));
  }

  function setSourceSelection(selection: SourceSelection): void {
    runTransaction(store, (state) => {
      if (state.sourceSelection === selection) {
        return { nextState: state };
      }
      return { nextState: patchState(state, { sourceSelection: selection }) };
    });
  }

  function setManualSourceDraft(value: string): void {
    runTransaction(store, (state) => {
      if (state.manualSourceDraft === value) {
        return { nextState: state };
      }
      return { nextState: patchState(state, { manualSourceDraft: value }) };
    });
  }

  function clearRawInput(): void {
    runTransaction(store, (state) => {
      if (state.rawTimeInput.length === 0 && state.lastResult === null) {
        if (state.calculationStep === "result" && state.viewMode === "calculation") {
          return { nextState: patchState(state, { calculationStep: "time" }) };
        }
        return { nextState: state };
      }
      const nextStep =
        state.calculationStep === "result" && state.viewMode === "calculation"
          ? "time"
          : state.calculationStep;
      return {
        nextState: patchState(state, {
          rawTimeInput: "",
          lastResult: null,
          calculationStep: nextStep,
        }),
      };
    });
  }

  function removeLastDigit(): void {
    runTransaction(store, (state) => {
      if (state.rawTimeInput.length === 0) {
        return { nextState: state };
      }
      return {
        nextState: patchState(state, {
          rawTimeInput: state.rawTimeInput.slice(0, -1),
          lastResult: null,
        }),
      };
    });
  }

  function appendDigit(digit: string): CalculationIssue | null {
    const outcome = runTransaction(store, (state) => {
      if (state.rawTimeInput.length >= TIME_DIGITS) {
        return { nextState: state, issue: null };
      }
      const rawTimeInput = state.rawTimeInput + digit;
      let nextState = patchState(state, {
        rawTimeInput,
        lastResult: null,
      });

      if (rawTimeInput.length === TIME_DIGITS) {
        const evaluation = evaluateCalculation(nextState);
        return evaluation;
      }

      return { nextState, issue: null };
    });

    return outcome.issue ?? null;
  }

  function attemptCalculation(): CalculationIssue | null {
    const outcome = runTransaction(store, (state) => evaluateCalculation(state));
    return outcome.issue ?? null;
  }

  function setSourcePower(
    power: number | null,
    options: { autoAdvance?: boolean } = {},
  ): { hasChanged: boolean; issue: CalculationIssue | null } {
    const { autoAdvance = true } = options;

    const outcome = runTransaction(store, (state) => {
      const previousPower = state.sourcePower;
      const hasChanged = previousPower !== power;

      let calculationStep = state.calculationStep;
      let rawTimeInput = state.rawTimeInput;
      let lastResult = state.lastResult;

      if (power === null) {
        lastResult = null;
        if (state.viewMode === "calculation") {
          calculationStep = "source";
        }
      } else if (hasChanged) {
        rawTimeInput = "";
        lastResult = null;
        if (state.viewMode === "calculation" && state.calculationStep === "result") {
          calculationStep = "time";
        }
      }

      let nextState = patchState(state, {
        sourcePower: power,
        rawTimeInput,
        lastResult,
        calculationStep,
      });

      if (power === null || !autoAdvance) {
        return { nextState, hasChanged, issue: null };
      }

      if (nextState.viewMode === "calculation" && nextState.calculationStep !== "time") {
        nextState = patchState(nextState, { calculationStep: "time" });
      }

      if (!hasChanged && nextState.rawTimeInput.length === TIME_DIGITS) {
        const evaluation = evaluateCalculation(nextState);
        return { ...evaluation, hasChanged };
      }

      return { nextState, hasChanged, issue: null };
    });

    return {
      hasChanged: outcome.hasChanged ?? false,
      issue: outcome.issue ?? null,
    };
  }

  function resetToSourceSelection(): void {
    runTransaction(store, (state) => {
      const updates: Partial<AppState> = {
        sourceSelection: null,
        manualSourceDraft: "",
        sourcePower: null,
        rawTimeInput: "",
        lastResult: null,
      };

      if (state.viewMode === "calculation") {
        updates.calculationStep = "source";
      }

      return { nextState: patchState(state, updates) };
    });
  }

  function initializeFromTarget(value: number): void {
    setTargetPower(value);
  }

  return {
    appendDigit,
    attemptCalculation,
    clearRawInput,
    goToStep,
    initializeFromTarget,
    removeLastDigit,
    resetToSourceSelection,
    setManualSourceDraft,
    setSourcePower,
    setSourceSelection,
    setTargetPower,
  };
}
