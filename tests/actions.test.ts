import { beforeEach, describe, expect, it } from "vitest";

import { createStateActions } from "../src/app/actions";
import { createAppStore, createInitialState } from "../src/app/state";

describe("createStateActions", () => {
  const targetPower = 600;
  const sourcePower = 500;
  let store = createAppStore(createInitialState());
  let actions = createStateActions(store);

  beforeEach(() => {
    store = createAppStore(createInitialState());
    actions = createStateActions(store);
  });

  it("setTargetPower switches to calculation mode and resets inputs", () => {
    actions.setTargetPower(targetPower);
    const state = store.getState();

    expect(state.viewMode).toBe("calculation");
    expect(state.calculationStep).toBe("source");
    expect(state.targetPower).toBe(targetPower);
    expect(state.rawTimeInput).toBe("");
    expect(state.sourcePower).toBeNull();
  });

  it("setSourcePower advances the step to time", () => {
    actions.setTargetPower(targetPower);
    actions.setSourcePower(sourcePower);
    const state = store.getState();

    expect(state.sourcePower).toBe(sourcePower);
    expect(state.calculationStep).toBe("time");
  });

  it("appendDigit computes the result once four digits are entered", () => {
    actions.setTargetPower(targetPower);
    actions.setSourcePower(sourcePower);

    actions.appendDigit("1");
    actions.appendDigit("2");
    actions.appendDigit("3");
    const issue = actions.appendDigit("4");

    expect(issue).toBeNull();
    const state = store.getState();
    expect(state.rawTimeInput).toBe("1234");
    expect(state.lastResult).not.toBeNull();
    expect(state.calculationStep).toBe("result");
    expect(state.lastResult?.targetSeconds).toBe(628);
  });

  it("returns missing-input when required values are not ready", () => {
    actions.setTargetPower(targetPower);
    const issue = actions.appendDigit("0");
    expect(issue).toBeNull();
    actions.appendDigit("0");
    actions.appendDigit("0");
    const finalIssue = actions.appendDigit("0");
    expect(finalIssue).toBe("missing-input");
    expect(store.getState().lastResult).toBeNull();
  });

  it("clearRawInput resets input and result then steps back", () => {
    actions.setTargetPower(targetPower);
    actions.setSourcePower(sourcePower);
    "1234".split("").forEach((digit) => actions.appendDigit(digit));

    actions.clearRawInput();

    const state = store.getState();
    expect(state.rawTimeInput).toBe("");
    expect(state.lastResult).toBeNull();
    expect(state.calculationStep).toBe("time");
  });

  it("removeLastDigit removes the last digit", () => {
    actions.setTargetPower(targetPower);
    actions.setSourcePower(sourcePower);
    actions.appendDigit("1");
    actions.appendDigit("2");
    actions.appendDigit("3");

    actions.removeLastDigit();

    expect(store.getState().rawTimeInput).toBe("12");
  });
});
