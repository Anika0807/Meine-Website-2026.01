import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const IMAGES_DIR = path.join(ROOT, 'public', 'images');
const WIDTHS = [480, 768, 1024, 1440, 1920];
const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const CONCURRENCY = 4;

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (!ALLOWED_EXT.has(ext)) continue;
    if (entry.name.includes('.__opt__')) continue;
    files.push(fullPath);
  }

  return files;
}

async function needsUpdate(sourcePath, targetPath) {
  try {
    const [srcStat, targetStat] = await Promise.all([fs.stat(sourcePath), fs.stat(targetPath)]);
    return srcStat.mtimeMs > targetStat.mtimeMs;
  } catch {
    return true;
  }
}

async function ensureVariant(sourcePath, width, format) {
  const ext = path.extname(sourcePath);
  const base = sourcePath.slice(0, -ext.length);
  const targetPath = `${base}.__opt__${width}.${format}`;

  if (!(await needsUpdate(sourcePath, targetPath))) return;

  const transformer = sharp(sourcePath).rotate().resize({
    width,
    fit: 'inside',
    withoutEnlargement: true,
  });

  if (format === 'webp') {
    await transformer.webp({ quality: 78, effort: 4 }).toFile(targetPath);
  } else {
    await transformer.avif({ quality: 52, effort: 4 }).toFile(targetPath);
  }
}

async function processImage(sourcePath) {
  for (const width of WIDTHS) {
    await ensureVariant(sourcePath, width, 'webp');
    await ensureVariant(sourcePath, width, 'avif');
  }
}

async function run() {
  try {
    await fs.access(IMAGES_DIR);
  } catch {
    console.log('[optimize-images] No public/images directory found, skipping.');
    return;
  }

  const files = await walk(IMAGES_DIR);
  if (!files.length) {
    console.log('[optimize-images] No source images found.');
    return;
  }

  let index = 0;
  async function worker() {
    while (index < files.length) {
      const current = files[index++];
      await processImage(current);
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  console.log(`[optimize-images] Processed ${files.length} image(s).`);
}

run().catch((error) => {
  console.error('[optimize-images] Failed:', error);
  process.exitCode = 1;
});
