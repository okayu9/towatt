import { describe, expect, it, vi } from "vitest";

import { createAppStore, createInitialState } from "../src/app/state";

describe("createAppStore", () => {
  it("notifies subscribers when state is updated", () => {
    const store = createAppStore(createInitialState());
    const listener = vi.fn();
    store.subscribe(listener);

    const nextState = { ...store.getState(), viewMode: "calculation" };
    store.setState(nextState);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(nextState);
  });

  it("emits only once when using batchUpdate", () => {
    const store = createAppStore(createInitialState());
    const listener = vi.fn();
    store.subscribe(listener);

    store.batchUpdate((state) => ({ ...state, rawTimeInput: "12", manualSourceDraft: "500" }));

    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.getState().rawTimeInput).toBe("12");
    expect(store.getState().manualSourceDraft).toBe("500");
  });
});
