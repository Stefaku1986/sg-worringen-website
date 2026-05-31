/**
 * Resize all images in public/images/content/ to 50% of their current dimensions.
 * Uses sharp (already available via Astro).
 */
import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname } from 'path';

const ROOT = 'public/images/content';
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const MIN_SIZE = 5000; // Skip files under 5KB (icons, tiny assets)

let processed = 0;
let skipped = 0;
let errors = 0;
let savedBytes = 0;

async function getAllImages(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getAllImages(fullPath));
    } else if (IMAGE_EXTS.has(extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }
  return files;
}

async function resizeImage(filePath) {
  try {
    const fileStat = await stat(filePath);
    if (fileStat.size < MIN_SIZE) {
      skipped++;
      return;
    }

    const originalSize = fileStat.size;
    const buffer = await sharp(filePath).toBuffer();
    const metadata = await sharp(buffer).metadata();

    if (!metadata.width || !metadata.height) {
      skipped++;
      return;
    }

    const newWidth = Math.round(metadata.width / 2);
    const newHeight = Math.round(metadata.height / 2);

    // Skip if already very small
    if (newWidth < 50 || newHeight < 50) {
      skipped++;
      return;
    }

    const resized = await sharp(buffer)
      .resize(newWidth, newHeight)
      .toBuffer();

    // Write back using sharp to ensure correct format
    await sharp(resized).toFile(filePath);

    const newSize = (await stat(filePath)).size;
    const saved = originalSize - newSize;
    savedBytes += saved;
    processed++;

    if (processed % 25 === 0) {
      console.log(`  ... ${processed} Bilder verarbeitet`);
    }
  } catch (err) {
    console.error(`  FEHLER: ${filePath}: ${err.message}`);
    errors++;
  }
}

console.log('Bilder-Resize: Starte...');
console.log(`Verzeichnis: ${ROOT}`);
console.log('Ziel: 50% der Originalgröße\n');

const images = await getAllImages(ROOT);
console.log(`${images.length} Bilder gefunden.\n`);

// Process in batches of 10 to avoid memory issues
const BATCH_SIZE = 10;
for (let i = 0; i < images.length; i += BATCH_SIZE) {
  const batch = images.slice(i, i + BATCH_SIZE);
  await Promise.all(batch.map(img => resizeImage(img)));
}

console.log('\n=== Ergebnis ===');
console.log(`Verarbeitet: ${processed}`);
console.log(`Übersprungen: ${skipped} (zu klein)`);
console.log(`Fehler: ${errors}`);
console.log(`Eingespart: ${(savedBytes / 1024 / 1024).toFixed(1)} MB`);
