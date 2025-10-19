import { createAppController } from "./controller";
import { queryAppElements } from "./dom";
import { createRenderer } from "./render";
import { createAppStore, createInitialState } from "./state";

export function initApp(): void {
  const elements = queryAppElements();
  const store = createAppStore(createInitialState());
  const render = createRenderer(elements);
  const controller = createAppController({ store, elements, render });
  controller.initialize();
}
