import { mkdir } from 'fs/promises';
import { resolve } from 'path';
import { build } from 'esbuild';
import { vanillaExtractPlugin } from '@vanilla-extract/esbuild-plugin';

const ENTRY_FILE = resolve('src/main.ts');
const OUT_DIR = resolve('build');
const OUT_FILE = resolve(OUT_DIR, 'main.js');

async function bundle() {
  await mkdir(OUT_DIR, { recursive: true });

  await build({
    entryPoints: [ENTRY_FILE],
    outfile: OUT_FILE,
    bundle: true,
    format: 'iife',
    platform: 'browser',
    target: ['es2017'],
    sourcemap: false,
    minify: true,
    treeShaking: true,
    plugins: [vanillaExtractPlugin()],
    logLevel: 'info',
  });
}

bundle().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
