/**
 * replace-image-urls.mjs
 * Replaces external sg-fussball.online image URLs with local paths.
 *
 * Strategy:
 *   - news.json: store paths WITHOUT leading slash or base prefix, e.g. "images/content/..."
 *     The .astro pages that render news will prepend ${base}.
 *   - spa_pages.json: store full path WITH base prefix, e.g. "/images/content/..."
 *     Because HTML is injected via set:html and base is not auto-applied.
 *   - .astro files: replace full URL strings inline. Since these files use template literals
 *     with ${base} or hardcoded strings, we just swap the URL for a ${base}images/content/... expression.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Read the Astro config to get the base path
const astroConfig = fs.readFileSync(path.join(ROOT, 'astro.config.mjs'), 'utf-8');
const baseMatch = astroConfig.match(/base:\s*['"]([^'"]+)['"]/);
const BASE = baseMatch ? baseMatch[1].replace(/\/?$/, '/') : '/';

console.log(`Base URL: ${BASE}`);

// Load the image map
const imageMap = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/image-map.json'), 'utf-8'));
console.log(`Loaded ${Object.keys(imageMap).length} URL mappings\n`);

// Build a sorted list of URLs to replace (longest first to avoid partial matches)
const allUrls = Object.keys(imageMap).sort((a, b) => b.length - a.length);

// ── Helper: Replace all matching URLs in a string ────────────────────

function replaceUrls(text, pathTransform) {
  let result = text;
  let count = 0;

  for (const url of allUrls) {
    if (result.includes(url)) {
      const localPath = pathTransform(imageMap[url]);
      // Use split+join for global replacement (no regex escaping needed)
      const before = result;
      result = result.split(url).join(localPath);
      if (result !== before) {
        count += before.split(url).length - 1;
      }
    }
  }

  return { result, count };
}

// ── 1. Replace in news.json ──────────────────────────────────────────

function processNewsJson() {
  const filePath = path.join(ROOT, 'data/news.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  let count = 0;

  for (const entry of data) {
    if (entry.images) {
      for (const img of entry.images) {
        if (img.src && imageMap[img.src]) {
          // Store WITHOUT leading slash: "images/content/..."
          img.src = imageMap[img.src].replace(/^\//, '');
          count++;
        }
      }
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
  console.log(`news.json: ${count} URLs replaced`);
}

// ── 2. Replace in spa_pages.json ─────────────────────────────────────

function processSpaPages() {
  const filePath = path.join(ROOT, 'data/spa_pages.json');
  let content = fs.readFileSync(filePath, 'utf-8');

  // For spa_pages, paths need the full base prefix since HTML is injected via set:html
  const { result, count } = replaceUrls(content, (localPath) => {
    // localPath is like "/images/content/..."
    // We need "/images/content/..." (base prefix from astro.config.mjs)
    return BASE + localPath.replace(/^\//, '');
  });

  fs.writeFileSync(filePath, result);
  console.log(`spa_pages.json: ${count} URLs replaced`);
}

// ── 3. Replace in .astro files ───────────────────────────────────────

function processAstroFiles() {
  const pagesDir = path.join(ROOT, 'src/pages');
  let totalCount = 0;

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.name.endsWith('.astro')) {
        let content = fs.readFileSync(full, 'utf-8');
        const hasBaseVar = content.includes('import.meta.env.BASE_URL') || content.includes('const base');

        const { result, count } = replaceUrls(content, (localPath) => {
          // localPath is like "/images/content/..."
          // In .astro files that have `const base`, we want to use template expressions
          // But since URLs appear in different contexts (string literals, JSX attributes),
          // we need to detect the context.
          // For simplicity: return a path that works with ${base} prepending.
          // The .astro files already have `const base = import.meta.env.BASE_URL;`
          // We'll store without leading slash so it can be concatenated with base.
          return localPath.replace(/^\//, '');
        });

        if (count > 0) {
          // Now we need to fix the .astro templates to prepend ${base} where needed.
          // The URLs appeared in contexts like:
          //   src="https://..." → needs to become src={`${base}images/content/...`}
          //   src: 'https://...' → needs to become src: `${base}images/content/...`
          //   image: 'https://...' → needs to become image: `${base}images/content/...`
          let fixed = result;

          // Fix JSX/HTML attributes: src="images/content/..." → src={`${base}images/content/...`}
          fixed = fixed.replace(/src="(images\/content\/[^"]+)"/g, 'src={`${base}$1`}');

          // Fix JS string literals in frontmatter: 'images/content/...' → `${base}images/content/...`
          // and "images/content/..." → `${base}images/content/...`
          fixed = fixed.replace(/'(images\/content\/[^']+)'/g, '`${base}$1`');

          fs.writeFileSync(full, fixed);
          const relPath = path.relative(ROOT, full);
          console.log(`${relPath}: ${count} URLs replaced`);
          totalCount += count;
        }
      }
    }
  }

  walk(pagesDir);
  console.log(`Total .astro replacements: ${totalCount}`);
}

// ── 4. Update neuigkeiten.astro and index.astro to prepend base to img.src ──

function updateAstroTemplates() {
  // neuigkeiten.astro: change src={img.src} → src={`${base}${img.src}`}
  const neuigkeitenPath = path.join(ROOT, 'src/pages/unser-verein/neuigkeiten.astro');
  let content = fs.readFileSync(neuigkeitenPath, 'utf-8');

  if (content.includes('src={img.src}')) {
    content = content.replace(/src=\{img\.src\}/g, 'src={`${base}${img.src}`}');
    fs.writeFileSync(neuigkeitenPath, content);
    console.log('\nneuigkeiten.astro: Updated img.src to use ${base} prefix');
  }

  // index.astro: change src={thumb.src} → src={`${base}${thumb.src}`}
  const indexPath = path.join(ROOT, 'src/pages/index.astro');
  let indexContent = fs.readFileSync(indexPath, 'utf-8');

  if (indexContent.includes('src={thumb.src}')) {
    indexContent = indexContent.replace(/src=\{thumb\.src\}/g, 'src={`${base}${thumb.src}`}');
    fs.writeFileSync(indexPath, indexContent);
    console.log('index.astro: Updated thumb.src to use ${base} prefix');
  }
}

// ── Main ─────────────────────────────────────────────────────────────

function main() {
  console.log('=== Replacing image URLs ===\n');

  processNewsJson();
  processSpaPages();
  processAstroFiles();
  updateAstroTemplates();

  console.log('\n=== All replacements complete ===');
}

main();
