import { initializeAnalyticsTracking } from "./analytics";
import { createAppController } from "./controller";
import { queryAppElements } from "./dom";
import { initializePrivacyPolicy } from "./privacy";
import { createRenderer } from "./render";
import { createAppStore, createInitialState } from "./state";

export function initApp(): void {
  const elements = queryAppElements();
  const store = createAppStore(createInitialState());
  initializeAnalyticsTracking(store);
  const render = createRenderer(elements);
  const controller = createAppController({ store, elements, render });
  initializePrivacyPolicy(elements);
  controller.initialize();
}
