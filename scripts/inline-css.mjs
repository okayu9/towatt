import { resolve } from "path";
import { inlineHtmlAsset } from "./lib/html-inline.mjs";

const SOURCE_HTML = resolve("src/index.html");
const BUILD_CSS = resolve("build/main.css");
const TARGET_HTML = resolve("build/index.html");

const CSS_LINK_PATTERN = /<link\s+rel="stylesheet"\s+href="\.\/main\.css"\s*\/?>(\r?\n)?/i;

function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function inlineCss() {
  await inlineHtmlAsset({
    sourceHtmlPath: SOURCE_HTML,
    assetPath: BUILD_CSS,
    outputHtmlPaths: [TARGET_HTML],
    transformAsset: minifyCss,
    replace(html, inlineCssContent) {
      const inlineStyle = `<style>${inlineCssContent}</style>`;
      return html.replace(CSS_LINK_PATTERN, `${inlineStyle}\n`);
    },
  });
}

inlineCss().catch((error) => {
  console.error("Failed to inline CSS:", error);
  process.exitCode = 1;
});
