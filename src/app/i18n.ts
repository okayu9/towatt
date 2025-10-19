import defaultLocaleData from "../locales/ja.json";

export type LocaleDictionary = Record<string, string>;

export const defaultLocale: LocaleDictionary = defaultLocaleData as LocaleDictionary;

declare global {
  interface Window {
    towattLocale?: Record<string, string> | undefined;
  }
}

export function getActiveLocale(): LocaleDictionary {
  const overrides = typeof window !== "undefined" ? window.towattLocale : undefined;
  if (overrides && typeof overrides === "object") {
    return { ...defaultLocale, ...overrides };
  }
  return { ...defaultLocale };
}

export function translate(
  dictionary: LocaleDictionary,
  key: string,
  params?: Record<string, string | number>,
): string {
  const template = dictionary[key];
  if (!template) {
    return key;
  }
  if (!params) {
    return template;
  }
  return Object.entries(params).reduce((text, [name, value]) => {
    const pattern = new RegExp(`\\{${name}\\}`, "g");
    return text.replace(pattern, String(value));
  }, template);
}

export function applyDocumentLocale(dictionary: LocaleDictionary): void {
  document.title = translate(dictionary, "document.title");

  const textElements = document.querySelectorAll<HTMLElement>("[data-locale-key]");
  textElements.forEach((element) => {
    const key = element.dataset.localeKey;
    if (!key) {
      return;
    }
    const htmlMode = element.dataset.localeMode === "html";
    const value = translate(dictionary, key);
    if (htmlMode) {
      element.innerHTML = value;
    } else {
      element.textContent = value;
    }
  });

  const attrElements = document.querySelectorAll<HTMLElement>("[data-locale-attr]");
  attrElements.forEach((element) => {
    const raw = element.dataset.localeAttr;
    if (!raw) {
      return;
    }
    raw.split(",").forEach((entry) => {
      const [attr, key] = entry.split(":");
      if (!attr || !key) {
        return;
      }
      const trimmedAttr = attr.trim();
      const trimmedKey = key.trim();
      element.setAttribute(trimmedAttr, translate(dictionary, trimmedKey));
    });
  });
}
