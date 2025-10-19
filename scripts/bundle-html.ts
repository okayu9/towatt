import { resolve } from "node:path";
import { inlineHtmlAsset } from "./lib/html-inline.js";

const BUILD_HTML = resolve("build/index.html");
const BUILD_JS = resolve("build/main.js");
const DIST_HTML = resolve("dist/index.html");

const SCRIPT_TAG_PATTERN = /<script\s+src="\.\/main\.js"\s+defer><\/script>/i;
const GA_PLACEHOLDER_PATTERN = /__GA_MEASUREMENT_ID__/g;
const GA_SNIPPET_WITH_COMMENTS_PATTERN =
  /<!--\s*GOOGLE_ANALYTICS_START\s*-->[\s\S]*?<!--\s*GOOGLE_ANALYTICS_END\s*-->/i;
const GA_SNIPPET_PATTERN =
  /<script\s+async\s+src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=__GA_MEASUREMENT_ID__"\s*><\/script>\s*<script>[\s\S]*?__GA_MEASUREMENT_ID__[\s\S]*?<\/script>/i;

function injectGaMeasurementId(html: string): string {
  const gaMeasurementId = process.env.GA_MEASUREMENT_ID?.trim();

  if (!gaMeasurementId) {
    return html
      .replace(GA_SNIPPET_WITH_COMMENTS_PATTERN, "")
      .replace(GA_SNIPPET_PATTERN, "");
  }

  return html.replace(GA_PLACEHOLDER_PATTERN, gaMeasurementId);
}

function sanitizeJs(js: string): string {
  return js.replace(/\/\/#[^\n]*$/gm, "").trim();
}

async function bundleHtml(): Promise<void> {
  await inlineHtmlAsset({
    sourceHtmlPath: BUILD_HTML,
    assetPath: BUILD_JS,
    outputHtmlPaths: [BUILD_HTML, DIST_HTML],
    transformAsset: sanitizeJs,
    replace(html, inlineJs) {
      const inlineScript = `<script>${inlineJs}</script>`;
      const inlinedHtml = html.replace(SCRIPT_TAG_PATTERN, inlineScript);
      return injectGaMeasurementId(inlinedHtml);
    },
  });
}

bundleHtml().catch((error) => {
  console.error("Failed to bundle HTML:", error);
  process.exitCode = 1;
});
