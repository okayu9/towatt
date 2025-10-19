import type { AppState } from "./types";

export type Listener = (state: AppState) => void;

export interface AppStore {
  getState(): AppState;
  setState(nextState: AppState): void;
  update(updater: (state: AppState) => AppState): void;
  batchUpdate(mutator: (state: AppState) => AppState): void;
  subscribe(listener: Listener): () => void;
}

export function createInitialState(): AppState {
  return {
    targetPower: null,
    sourcePower: null,
    manualSourceDraft: "",
    rawTimeInput: "",
    viewMode: "setup",
    sourceSelection: null,
    calculationStep: "source",
    lastResult: null,
  };
}

export function createAppStore(initialState: AppState): AppStore {
  let currentState = initialState;
  const listeners = new Set<Listener>();

  function emit(state: AppState): void {
    listeners.forEach((listener) => listener(state));
  }

  function apply(nextState: AppState): void {
    if (Object.is(nextState, currentState)) {
      return;
    }
    currentState = nextState;
    emit(currentState);
  }

  return {
    getState(): AppState {
      return currentState;
    },
    setState(nextState: AppState): void {
      apply(nextState);
    },
    update(updater: (state: AppState) => AppState): void {
      apply(updater(currentState));
    },
    batchUpdate(mutator: (state: AppState) => AppState): void {
      const nextState = mutator(currentState);
      apply(nextState);
    },
    subscribe(listener: Listener): () => void {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
