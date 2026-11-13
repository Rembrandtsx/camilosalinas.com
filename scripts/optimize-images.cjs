// Originals stay in assets/images so image variants can be regenerated without quality loss.
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..');
const sources = require('./image-sources.json');
async function main() {
  const manifest = {};
  const previous = JSON.parse(await fs.readFile(path.join(root, 'scripts/image-manifest.json'), 'utf8').catch(() => '{}'));
  let html = await fs.readFile(path.join(root, 'index.html'), 'utf8');
  await fs.mkdir(path.join(root, 'assets/optimized'), { recursive: true });
  for (const { source, width } of sources) {
    const input = await fs.readFile(path.join(root, source));
    const metadata = await sharp(input, { animated: true, limitInputPixels: false }).metadata();
    const rotated = [5, 6, 7, 8].includes(metadata.orientation);
    const originalWidth = rotated ? metadata.height : metadata.width;
    const originalHeight = rotated ? metadata.width : (metadata.pageHeight || metadata.height);
    const widths = [...new Set([Math.min(source.startsWith("assets/images/Me/") ? 360 : 640, width, originalWidth), Math.min(width, originalWidth)])];
    const variants = [];
    for (const targetWidth of widths) {
      const buffer = await sharp(input, { animated: true, limitInputPixels: false }).rotate()
        .resize({ width: targetWidth, withoutEnlargement: true })
        .webp({ quality: 80, effort: 5 }).toBuffer();
      const hash = crypto.createHash('sha256').update(buffer).digest('hex').slice(0, 12);
      const stem = path.basename(source, path.extname(source)).toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const output = 'assets/optimized/' + stem + '-' + targetWidth + '-' + hash + '.webp';
      await fs.writeFile(path.join(root, output), buffer);
      variants.push({ source: output, width: targetWidth, bytes: buffer.length });
    }
    manifest[source] = { width: originalWidth, height: originalHeight, originalBytes: input.length, variants };
  }
  // Keep content-hashed URLs and intrinsic dimensions in the HTML in sync on regeneration.
  html = html.replace(/<img\b[^>]*>/g, (tag) => {
    const source = Object.keys(previous).find((key) => previous[key].variants.some((variant) => tag.includes(variant.source)));
    if (!source || !manifest[source]) return tag;
    return tag.replace(/width="[^"]*"/, 'width="' + manifest[source].width + '"')
      .replace(/height="[^"]*"/, 'height="' + manifest[source].height + '"');
  });
  for (const [source, before] of Object.entries(previous)) {
    const after = manifest[source];
    if (!after) continue;
    for (const old of before.variants) {
      const next = after.variants.find((variant) => variant.width === old.width) || after.variants.at(-1);
      html = html.replaceAll(old.source + ' ' + old.width + 'w', next.source + ' ' + next.width + 'w');
      html = html.replaceAll(old.source, next.source);
    }
  }
  await fs.writeFile(path.join(root, 'index.html'), html);
  await fs.writeFile(path.join(root, 'scripts/image-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  const entries = Object.values(manifest);
  console.log(JSON.stringify({ images: entries.length, originalBytes: entries.reduce((n,i) => n+i.originalBytes,0), optimizedBytes: entries.reduce((n,i) => n+i.variants.at(-1).bytes,0) }));
}
main().catch(error => { console.error(error); process.exitCode = 1; });
