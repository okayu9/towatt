import { readFile, writeFile, mkdir } from "fs/promises";
import { dirname, resolve } from "path";

const SOURCE_HTML = resolve("src/index.html");
const SOURCE_CSS = resolve("src/styles.css");
const TARGET_HTML = resolve("build/index.html");

function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function inlineCss() {
  const [html, css] = await Promise.all([
    readFile(SOURCE_HTML, "utf8"),
    readFile(SOURCE_CSS, "utf8"),
  ]);

  const inlineStyle = `<style>${minifyCss(css)}</style>`;
  const updatedHtml = html.replace(
    /<link\s+rel="stylesheet"\s+href="\.\/styles\.css"\s*\/?>(\r?\n)?/i,
    `${inlineStyle}\n`
  );

  await mkdir(dirname(TARGET_HTML), { recursive: true });
  await writeFile(TARGET_HTML, updatedHtml, "utf8");
}

inlineCss().catch((error) => {
  console.error("Failed to inline CSS:", error);
  process.exitCode = 1;
});
