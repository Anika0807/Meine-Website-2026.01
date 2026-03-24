import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const IMAGES_DIR = path.resolve('public/images');
const SOURCE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png']);

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return walk(fullPath);
      }
      return [fullPath];
    })
  );
  return files.flat();
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function needsUpdate(sourcePath, outputPath) {
  if (!(await exists(outputPath))) return true;
  const [src, out] = await Promise.all([fs.stat(sourcePath), fs.stat(outputPath)]);
  return src.mtimeMs > out.mtimeMs;
}

async function optimizeImage(sourcePath) {
  const ext = path.extname(sourcePath).toLowerCase();
  if (!SOURCE_EXTENSIONS.has(ext)) return { skipped: true, updated: false };

  const outputPath = sourcePath.replace(/\.[^.]+$/i, '.webp');
  if (!(await needsUpdate(sourcePath, outputPath))) {
    return { skipped: false, updated: false };
  }

  await sharp(sourcePath)
    .rotate()
    .webp({ quality: 82, effort: 5 })
    .toFile(outputPath);

  return { skipped: false, updated: true };
}

async function run() {
  const files = await walk(IMAGES_DIR);
  let converted = 0;
  let unchanged = 0;
  let skipped = 0;
  let failed = 0;

  for (const file of files) {
    try {
      const result = await optimizeImage(file);
      if (result.skipped) {
        skipped += 1;
      } else if (result.updated) {
        converted += 1;
      } else {
        unchanged += 1;
      }
    } catch (error) {
      failed += 1;
      console.warn(`[optimize-images] Failed: ${file}`);
      console.warn(error instanceof Error ? error.message : String(error));
    }
  }

  console.log(
    `[optimize-images] done | converted=${converted} unchanged=${unchanged} skipped=${skipped} failed=${failed}`
  );

  if (failed > 0) {
    process.exitCode = 1;
  }
}

run().catch((error) => {
  console.error('[optimize-images] fatal error');
  console.error(error instanceof Error ? error.stack : String(error));
  process.exit(1);
});
