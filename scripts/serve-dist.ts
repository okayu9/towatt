import http from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { extname, relative, resolve, sep } from "node:path";

const DIST_DIR = resolve("dist");
const HOST = process.env.HOST ?? "127.0.0.1";
const PORT = Number.parseInt(process.env.PORT ?? "4173", 10);

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml; charset=utf-8",
};

function toDistPath(urlPath: string): string {
  const safePath = urlPath.split("?")[0].split("#")[0];
  const normalized = safePath === "/" ? "/index.html" : safePath;
  const segments = normalized.split("/").filter(Boolean);
  const fullPath = resolve(DIST_DIR, ...segments);
  const relativePath = relative(DIST_DIR, fullPath);
  if (relativePath === ".." || relativePath.startsWith(`..${sep}`) || resolve(relativePath) === relativePath) {
    return resolve(DIST_DIR, "index.html");
  }
  return fullPath;
}

async function resolveDistFile(urlPath: string): Promise<string> {
  const filePath = toDistPath(urlPath);
  const fileStat = await stat(filePath).catch(() => null);
  if (!fileStat) {
    return resolve(DIST_DIR, "index.html");
  }
  return fileStat.isDirectory() ? resolve(filePath, "index.html") : filePath;
}

const server = http.createServer(async (req, res) => {
  try {
    const streamPath = await resolveDistFile(req.url ?? "/");
    const ext = extname(streamPath);

    res.writeHead(200, {
      "Content-Type": MIME_TYPES[ext] ?? "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    });

    const stream = createReadStream(streamPath);
    stream.on("error", () => {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Internal Server Error");
    });
    stream.pipe(res);
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Failed to serve dist assets\n" + String(error));
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Serving dist at http://${HOST}:${PORT}`);
});
