import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

async function readText(filePath: string): Promise<string> {
  return readFile(filePath, "utf8");
}

async function writeText(filePath: string, contents: string): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, contents, "utf8");
}

function minifyHtml(html: string): string {
  return html
    .replace(/<!--(?!\s*\[if).*?-->/gs, "")
    .replace(/\s+/g, " ")
    .replace(/>\s+</g, "><")
    .replace(/\s+(\/?>)/g, "$1")
    .trim();
}

export interface InlineHtmlAssetOptions {
  sourceHtmlPath: string;
  assetPath: string;
  outputHtmlPaths: readonly string[];
  transformAsset?: (asset: string) => string;
  replace: (html: string, inlineAsset: string) => string;
}

export async function inlineHtmlAsset({
  sourceHtmlPath,
  assetPath,
  outputHtmlPaths,
  transformAsset = (asset) => asset,
  replace,
}: InlineHtmlAssetOptions): Promise<string> {
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
