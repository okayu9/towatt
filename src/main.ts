import { initApp } from "./app/app";
import { applyDocumentLocale, getActiveLocale } from "./app/i18n";
import "./styles.css.ts";

document.addEventListener("DOMContentLoaded", () => {
  const locale = getActiveLocale();
  applyDocumentLocale(locale);
  initApp(locale);
});
