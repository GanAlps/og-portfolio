// Compress / resize sourced blog images in place using sharp.
// Usage:
//   node scripts/compress-images.mjs <file_or_folder> [...more]
// Behaviour:
//   - PNG: re-encode with palette quantisation + max compression.
//   - JPEG: re-encode with mozjpeg quality 85.
//   - GIF / SVG / WEBP: skipped.
//   - Resize to MAX_WIDTH if wider.
//   - Idempotent (running twice produces ~the same output).

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const MAX_WIDTH = 1500;
const PNG_COMPRESSION = 9;
const JPG_QUALITY = 85;

const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg"]);
const SKIP_EXTS = new Set([".svg", ".gif", ".webp", ".avif"]);

async function compressFile(filepath) {
  const ext = path.extname(filepath).toLowerCase();
  if (SKIP_EXTS.has(ext)) {
    return { filepath, skipped: true, reason: `skip ${ext}` };
  }
  if (!IMAGE_EXTS.has(ext)) {
    return { filepath, skipped: true, reason: `unsupported ${ext}` };
  }

  const before = fs.statSync(filepath).size;
  const meta = await sharp(filepath).metadata();
  let pipeline = sharp(filepath, { failOn: "none" });

  if (meta.width && meta.width > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  if (ext === ".png") {
    pipeline = pipeline.png({
      compressionLevel: PNG_COMPRESSION,
      palette: true,
      effort: 9,
    });
  } else if (ext === ".jpg" || ext === ".jpeg") {
    pipeline = pipeline.jpeg({ quality: JPG_QUALITY, mozjpeg: true });
  }

  const tmp = filepath + ".compressing.tmp";
  await pipeline.toFile(tmp);
  const after = fs.statSync(tmp).size;

  // Only replace if we actually saved bytes (avoids increasing on already-tight images).
  if (after < before) {
    fs.renameSync(tmp, filepath);
    return { filepath, before, after, ratio: after / before };
  }
  fs.unlinkSync(tmp);
  return { filepath, before, after: before, ratio: 1, skipped: true, reason: "no gain" };
}

async function* walk(p) {
  const stat = fs.statSync(p);
  if (stat.isFile()) {
    yield p;
    return;
  }
  for (const entry of fs.readdirSync(p, { withFileTypes: true })) {
    const full = path.join(p, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else {
      yield full;
    }
  }
}

function fmt(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
}

async function main() {
  const targets = process.argv.slice(2);
  if (!targets.length) {
    console.error("usage: compress-images.mjs <file_or_folder> [...]");
    process.exit(2);
  }

  let totalBefore = 0;
  let totalAfter = 0;
  let processed = 0;

  for (const t of targets) {
    for await (const f of walk(t)) {
      const result = await compressFile(f);
      if (result.skipped) {
        if (result.before) {
          // already small / no gain
          totalBefore += result.before;
          totalAfter += result.after;
        }
        continue;
      }
      processed += 1;
      totalBefore += result.before;
      totalAfter += result.after;
      console.log(
        `${path.relative(process.cwd(), result.filepath)}: ${fmt(result.before)} → ${fmt(result.after)} (${(result.ratio * 100).toFixed(0)}%)`,
      );
    }
  }

  if (totalBefore > 0) {
    console.log(
      `\nTotal: ${fmt(totalBefore)} → ${fmt(totalAfter)} (${((totalAfter / totalBefore) * 100).toFixed(0)}%) across ${processed} files`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
