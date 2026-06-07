import { rm } from "node:fs/promises";
import { resolve } from "node:path";

const OUTPUT_DIRS = ["build", "dist"];

async function clean(): Promise<void> {
  await Promise.all(
    OUTPUT_DIRS.map((directory) =>
      rm(resolve(directory), { recursive: true, force: true }),
    ),
  );
}

clean().catch((error) => {
  console.error("Failed to clean generated output:", error);
  process.exitCode = 1;
});
