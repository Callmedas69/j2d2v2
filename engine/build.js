import { build } from "esbuild";
import { glob } from "glob";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const entryPoints = await glob('src/**/*.ts', {
  ignore: ['**/*.test.ts', '**/*.spec.ts'],
  cwd: __dirname,
});

try {
  await build({
    entryPoints,
    outdir: 'dist',
    bundle: false,
    platform: 'neutral',
    format: 'esm',
    target: ['es2020'],
  });
  console.log('Build completed successfully');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}