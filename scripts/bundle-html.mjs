import { readFile, writeFile, mkdir } from "fs/promises";
import { resolve } from "path";

const BUILD_HTML = resolve("build/index.html");
const BUILD_JS = resolve("build/main.js");
const DIST_HTML = resolve("dist/index.html");

function sanitizeJs(js) {
  return js.replace(/\/\/#[^\n]*$/gm, "").trim();
}

async function bundleHtml() {
  const [html, js] = await Promise.all([
    readFile(BUILD_HTML, "utf8"),
    readFile(BUILD_JS, "utf8"),
  ]);

  const inlineScript = `<script>${sanitizeJs(js)}</script>`;
  const bundledHtml = html.replace(
    /<script\s+src="\.\/main\.js"\s+defer><\/script>/i,
    `${inlineScript}`
  );

  await writeFile(BUILD_HTML, bundledHtml, "utf8");
  await mkdir(resolve("dist"), { recursive: true });
  await writeFile(DIST_HTML, bundledHtml, "utf8");
}

bundleHtml().catch((error) => {
  console.error("Failed to bundle HTML:", error);
  process.exitCode = 1;
});
