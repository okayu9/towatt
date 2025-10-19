export type ViewMode = "setup" | "calculation";

export type SourceSelection = "preset" | "manual" | null;

export type CalculationStep = "source" | "time" | "result";

export interface TimeParts {
  minutes: number;
  seconds: number;
  totalSeconds: number;
}

export interface CalculationResult {
  targetSeconds: number;
  sourcePreview: TimeParts;
}

export interface AppState {
  targetPower: number | null;
  sourcePower: number | null;
  manualSourceDraft: string;
  rawTimeInput: string;
  viewMode: ViewMode;
  sourceSelection: SourceSelection;
  calculationStep: CalculationStep;
  lastResult: CalculationResult | null;
}
