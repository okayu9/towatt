import { beforeEach, describe, expect, it } from "vitest";

import { applyDocumentLocale, getActiveLocale } from "../src/app/i18n";

describe("i18n", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    window.towattLocale = undefined;
  });

  it("applies trusted locale HTML for known rich-text keys", () => {
    const element = document.createElement("p");
    element.dataset.localeKey = "privacy.section.analytics.body";
    element.dataset.localeMode = "html";
    document.body.appendChild(element);

    applyDocumentLocale(getActiveLocale());

    expect(element.querySelector("a")).not.toBeNull();
  });

  it("does not allow runtime overrides for trusted HTML keys", () => {
    window.towattLocale = {
      "privacy.section.analytics.body": '<img src=x onerror="alert(1)">',
      "setup.title": "Custom title",
    };

    const htmlElement = document.createElement("p");
    htmlElement.dataset.localeKey = "privacy.section.analytics.body";
    htmlElement.dataset.localeMode = "html";

    const textElement = document.createElement("h1");
    textElement.dataset.localeKey = "setup.title";

    document.body.append(htmlElement, textElement);

    applyDocumentLocale(getActiveLocale());

    expect(htmlElement.querySelector("img")).toBeNull();
    expect(textElement.textContent).toBe("Custom title");
  });

  it("falls back to text content for unknown html-mode keys", () => {
    const element = document.createElement("p");
    element.dataset.localeKey = "custom.html";
    element.dataset.localeMode = "html";
    document.body.appendChild(element);

    applyDocumentLocale({ "custom.html": "<strong>safe text</strong>" });

    expect(element.querySelector("strong")).toBeNull();
    expect(element.textContent).toBe("<strong>safe text</strong>");
  });
});
