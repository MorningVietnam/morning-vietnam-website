#!/usr/bin/env node
/**
 * Nén ảnh trong public/ trước khi commit — giữ Vercel Deployment Storage thấp.
 *
 * Cách dùng (chạy ở thư mục gốc dự án):
 *   npm run optimize-images -- --dry      # chỉ xem báo cáo, KHÔNG ghi đè
 *   npm run optimize-images               # nén thật (backup bản gốc trước)
 *   npm run optimize-images -- --restore  # khôi phục toàn bộ bản gốc
 *
 * Quy tắc:
 *   - Quét TOÀN BỘ public/ (tours, team, blog, catalogue, ảnh lẻ...)
 *   - Chỉ xét ảnh > 500KB. Giữ nguyên tên file + định dạng → không phải sửa code.
 *   - Ảnh thường: cạnh dài tối đa 1920px, quality 82.
 *   - Trang brochure (catalogue/, travel-guide/): tối đa 2000px, quality 85 (có chữ).
 *   - Chỉ thay file nếu nhỏ đi ít nhất 10% (tránh nén lại vô ích làm giảm nét).
 *   - Backup bản gốc vào _originals/precompress/ — NGOÀI public/, đã gitignore.
 *     ⚠️ Không bao giờ để backup trong public/: mọi thứ trong public/ đều bị
 *     deploy lên Vercel và tính vào Deployment Storage.
 */

import { readdir, stat, mkdir, copyFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, relative, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT    = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC  = join(ROOT, 'public');
const BAK_DIR = join(ROOT, '_originals', 'precompress');

const MIN_SIZE   = 500 * 1024;   // chỉ xét ảnh > 500KB
const MIN_SAVING = 0.10;         // phải nhỏ đi ≥ 10% mới thay
const IMG_EXT    = /\.(webp|jpe?g|png)$/i;
const SKIP_DIRS  = new Set(['tours.backup']); // phòng hờ backup cũ còn sót

const args = new Set(process.argv.slice(2));
const isDry = args.has('--dry');
const isRestore = args.has('--restore');

const fmt = (b) => b < 1048576 ? `${(b / 1024).toFixed(0)}KB` : `${(b / 1048576).toFixed(2)}MB`;

async function walk(dir) {
  const out = [];
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(ent.name)) continue;
    const p = join(dir, ent.name);
    if (ent.isDirectory()) out.push(...await walk(p));
    else if (IMG_EXT.test(ent.name)) out.push(p);
  }
  return out;
}

function rulesFor(rel) {
  const isBrochure = rel.startsWith('catalogue/') || rel.startsWith('travel-guide/');
  return isBrochure ? { max: 2000, q: 85 } : { max: 1920, q: 82 };
}

async function encode(file, rel) {
  const { max, q } = rulesFor(rel);
  const img = sharp(file).rotate().resize({ width: max, height: max, fit: 'inside', withoutEnlargement: true });
  const ext = extname(file).toLowerCase();
  if (ext === '.webp') return img.webp({ quality: q, effort: 5 }).toBuffer();
  if (ext === '.png')  return img.png({ compressionLevel: 9, palette: false }).toBuffer();
  return img.jpeg({ quality: q, mozjpeg: true, progressive: true }).toBuffer();
}

async function restore() {
  if (!existsSync(BAK_DIR)) return console.log('Không có backup tại', BAK_DIR);
  const files = await walk(BAK_DIR);
  for (const f of files) {
    const dst = join(PUBLIC, relative(BAK_DIR, f));
    await mkdir(dirname(dst), { recursive: true });
    await copyFile(f, dst);
  }
  console.log(`Đã khôi phục ${files.length} file từ _originals/precompress/`);
}

async function optimize() {
  const files = await walk(PUBLIC);
  console.log(`Quét ${files.length} ảnh trong public/ — ${isDry ? 'DRY RUN (không ghi đè)' : 'GHI ĐÈ'}\n`);
  let before = 0, after = 0, changed = 0, errors = 0;

  for (const file of files) {
    const rel = relative(PUBLIC, file);
    const size = (await stat(file)).size;
    if (size <= MIN_SIZE) continue;
    try {
      const buf = await encode(file, rel);
      before += size;
      if (buf.length > size * (1 - MIN_SAVING)) { after += size; continue; }
      after += buf.length; changed++;
      console.log(`  ${rel.padEnd(55)} ${fmt(size).padStart(8)} → ${fmt(buf.length).padStart(8)}`);
      if (!isDry) {
        const bak = join(BAK_DIR, rel);
        if (!existsSync(bak)) { await mkdir(dirname(bak), { recursive: true }); await copyFile(file, bak); }
        await writeFile(file, buf);
      }
    } catch (e) { errors++; console.error(`  LỖI ${rel}: ${e.message}`); }
  }

  console.log(`\nThay ${changed} file | Lỗi ${errors}`);
  console.log(`Ảnh >500KB: ${fmt(before)} → ${fmt(after)}${before ? ` (giảm ${((1 - after / before) * 100).toFixed(0)}%)` : ''}`);
  if (isDry) console.log('(Dry run — chưa thay đổi gì)');
  else if (changed) console.log('Bản gốc đã lưu ở _originals/precompress/');
}

isRestore ? await restore() : await optimize();
