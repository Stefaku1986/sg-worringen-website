/**
 * download-images.mjs
 * Downloads all external images from sg-fussball.online and saves them locally.
 * Produces data/image-map.json mapping original URLs to local paths.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const CM4ALL_PATTERN = /https:\/\/sg-fussball\.online\/\.cm4all\/uproc\.php\/0\/[^\s"'<>)\\]+/g;

// ── 1. Collect all unique image URLs ─────────────────────────────────

function collectFromNewsJson() {
  const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/news.json'), 'utf-8'));
  const urls = [];
  for (const entry of data) {
    if (entry.images) {
      for (const img of entry.images) {
        if (img.src && img.src.includes('sg-fussball.online')) {
          urls.push(img.src);
        }
      }
    }
  }
  return urls;
}

function collectFromSpaPages() {
  const raw = fs.readFileSync(path.join(ROOT, 'data/spa_pages.json'), 'utf-8');
  const matches = raw.match(CM4ALL_PATTERN) || [];
  // Clean up any trailing quotes or HTML entities
  return matches.map(u => u.replace(/["'<>].*$/, ''));
}

function collectFromAstroFiles() {
  const urls = [];
  const pagesDir = path.join(ROOT, 'src/pages');

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.name.endsWith('.astro')) {
        const content = fs.readFileSync(full, 'utf-8');
        const matches = content.match(CM4ALL_PATTERN) || [];
        for (const m of matches) {
          urls.push(m.replace(/["'<>].*$/, ''));
        }
      }
    }
  }

  walk(pagesDir);
  return urls;
}

// ── 2. Normalize URL → local path ────────────────────────────────────

function normalizeUrl(url) {
  // Always use picture-800
  let normalized = url.replace(/\/picture-200(\?|$)/, '/picture-800$1');
  return normalized;
}

function urlToLocalPath(url) {
  // Extract path between /0/ and /picture-{size}
  const match = url.match(/\/0\/(.+?)\/picture-\d+/);
  if (!match) {
    // Try without picture- suffix (shouldn't happen but be safe)
    const match2 = url.match(/\/0\/(.+?)(\?|$)/);
    if (!match2) return null;
    return cleanPath(match2[1]);
  }
  return cleanPath(match[1]);
}

function cleanPath(rawPath) {
  // Decode URL-encoded characters
  let decoded = decodeURIComponent(rawPath);

  // Split into directory parts and filename
  const parts = decoded.split('/');
  const filename = parts.pop();
  const dirs = parts;

  // Clean filename: remove leading dots, replace spaces/special chars
  let cleanName = filename
    .replace(/^\.+/, '')           // remove leading dots
    .replace(/\s+/g, '_')         // spaces → underscores
    .replace(/[()]/g, '')         // remove parens
    .replace(/&/g, '_and_')       // & → _and_
    .replace(/[^a-zA-Z0-9._\-äöüÄÖÜß]/g, '_')  // other special chars → underscore
    .replace(/_+/g, '_')          // collapse multiple underscores
    .replace(/^_|_$/g, '');       // trim leading/trailing underscores

  // Clean directory names similarly but keep them readable
  const cleanDirs = dirs.map(d => {
    return d
      .replace(/^\.+/, '')
      .replace(/\s+/g, '_')
      .replace(/[()]/g, '')
      .replace(/&/g, '_and_')
      .replace(/[^a-zA-Z0-9._\-äöüÄÖÜß]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
  });

  return [...cleanDirs, cleanName].join('/');
}

// ── 3. Download with concurrency control ─────────────────────────────

async function downloadFile(url, localPath) {
  const fullPath = path.join(ROOT, 'public/images/content', localPath);

  // Skip if already exists
  if (fs.existsSync(fullPath)) {
    return { status: 'skipped', localPath };
  }

  // Ensure directory exists
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SG-Worringen-Migration/1.0)',
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(fullPath, buffer);
    return { status: 'downloaded', localPath, size: buffer.length };
  } catch (err) {
    return { status: 'error', localPath, error: err.message };
  }
}

async function downloadAll(tasks, concurrency = 5) {
  const results = [];
  let idx = 0;

  async function worker() {
    while (idx < tasks.length) {
      const i = idx++;
      const { url, localPath } = tasks[i];
      const result = await downloadFile(url, localPath);
      results.push({ ...result, url });

      const prefix = `[${results.length}/${tasks.length}]`;
      if (result.status === 'downloaded') {
        const kb = Math.round(result.size / 1024);
        console.log(`${prefix} Downloaded ${localPath} (${kb} KB)`);
      } else if (result.status === 'skipped') {
        console.log(`${prefix} Skipped (exists) ${localPath}`);
      } else {
        console.error(`${prefix} ERROR ${localPath}: ${result.error}`);
      }
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);
  return results;
}

// ── Main ─────────────────────────────────────────────────────────────

async function main() {
  console.log('=== Collecting image URLs ===\n');

  const newsUrls = collectFromNewsJson();
  console.log(`  news.json:      ${newsUrls.length} URLs`);

  const spaUrls = collectFromSpaPages();
  console.log(`  spa_pages.json: ${spaUrls.length} URLs`);

  const astroUrls = collectFromAstroFiles();
  console.log(`  .astro files:   ${astroUrls.length} URLs`);

  // Deduplicate, normalizing to picture-800
  const urlMap = new Map(); // normalized URL → original URLs
  for (const url of [...newsUrls, ...spaUrls, ...astroUrls]) {
    const normalized = normalizeUrl(url);
    if (!urlMap.has(normalized)) {
      urlMap.set(normalized, []);
    }
    urlMap.get(normalized).push(url);
  }

  console.log(`\n  Unique (after normalization): ${urlMap.size}\n`);

  // Build download tasks
  const tasks = [];
  const imageMap = {}; // originalURL → localPath (for replacement)

  for (const [normalizedUrl, originalUrls] of urlMap) {
    const localPath = urlToLocalPath(normalizedUrl);
    if (!localPath) {
      console.warn(`  Could not parse path from: ${normalizedUrl}`);
      continue;
    }

    tasks.push({ url: normalizedUrl, localPath });

    // Map ALL original URLs (including non-normalized variants) to the same local path
    for (const origUrl of originalUrls) {
      imageMap[origUrl] = `/images/content/${localPath}`;
    }
    // Also map the normalized URL
    imageMap[normalizedUrl] = `/images/content/${localPath}`;
  }

  console.log(`=== Downloading ${tasks.length} images ===\n`);
  const results = await downloadAll(tasks, 5);

  const downloaded = results.filter(r => r.status === 'downloaded').length;
  const skipped = results.filter(r => r.status === 'skipped').length;
  const errors = results.filter(r => r.status === 'error').length;

  console.log(`\n=== Done ===`);
  console.log(`  Downloaded: ${downloaded}`);
  console.log(`  Skipped:    ${skipped}`);
  console.log(`  Errors:     ${errors}`);

  if (errors > 0) {
    console.log('\nFailed downloads:');
    for (const r of results.filter(r => r.status === 'error')) {
      console.log(`  ${r.localPath}: ${r.error}`);
    }
  }

  // Save mapping
  const mapPath = path.join(ROOT, 'data/image-map.json');
  fs.writeFileSync(mapPath, JSON.stringify(imageMap, null, 2));
  console.log(`\nSaved mapping to ${mapPath} (${Object.keys(imageMap).length} entries)`);
}

main().catch(console.error);
