import { initializeAnalyticsTracking } from "./analytics";
import { createAppController } from "./controller";
import { queryAppElements } from "./dom";
import { initializePrivacyPolicy } from "./privacy";
import { createRenderer } from "./render";
import { createAppStore, createInitialState } from "./state";
import type { LocaleDictionary } from "./i18n";

export function initApp(locale: LocaleDictionary): void {
  const elements = queryAppElements();
  const store = createAppStore(createInitialState());
  initializeAnalyticsTracking(store);
  const render = createRenderer(elements, locale);
  const controller = createAppController({ store, elements, render, locale });
  initializePrivacyPolicy(elements);
  controller.initialize();
}
