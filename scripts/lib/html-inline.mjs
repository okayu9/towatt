import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname } from "path";

async function readText(filePath) {
  return readFile(filePath, "utf8");
}

async function writeText(filePath, contents) {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, contents, "utf8");
}

function minifyHtml(html) {
  return html
    .replace(/<!--(?!\s*\[if).*?-->/gs, "")
    .replace(/\s+/g, " ")
    .replace(/>\s+</g, "><")
    .replace(/\s+(\/?>)/g, "$1")
    .trim();
}

export async function inlineHtmlAsset({
  sourceHtmlPath,
  assetPath,
  outputHtmlPaths,
  transformAsset = (asset) => asset,
  replace,
}) {
  const [html, asset] = await Promise.all([
    readText(sourceHtmlPath),
    readText(assetPath),
  ]);

  const inlineAsset = transformAsset(asset);
  const updatedHtml = replace(html, inlineAsset);

  if (updatedHtml === html) {
    throw new Error("Inline replacement did not modify the HTML content.");
  }

  const minifiedHtml = minifyHtml(updatedHtml);

  await Promise.all(
    outputHtmlPaths.map((filePath) => writeText(filePath, minifiedHtml)),
  );

  return minifiedHtml;
}
