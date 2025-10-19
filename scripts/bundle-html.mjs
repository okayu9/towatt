import { resolve } from "path";
import { inlineHtmlAsset } from "./lib/html-inline.mjs";

const BUILD_HTML = resolve("build/index.html");
const BUILD_JS = resolve("build/main.js");
const DIST_HTML = resolve("dist/index.html");

const SCRIPT_TAG_PATTERN = /<script\s+src="\.\/main\.js"\s+defer><\/script>/i;

function sanitizeJs(js) {
  return js.replace(/\/\/#[^\n]*$/gm, "").trim();
}

async function bundleHtml() {
  await inlineHtmlAsset({
    sourceHtmlPath: BUILD_HTML,
    assetPath: BUILD_JS,
    outputHtmlPaths: [BUILD_HTML, DIST_HTML],
    transformAsset: sanitizeJs,
    replace(html, inlineJs) {
      const inlineScript = `<script>${inlineJs}</script>`;
      return html.replace(SCRIPT_TAG_PATTERN, inlineScript);
    },
  });
}

bundleHtml().catch((error) => {
  console.error("Failed to bundle HTML:", error);
  process.exitCode = 1;
});
