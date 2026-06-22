#!/usr/bin/env node
/**
 * Optimize tour gallery images.
 *
 * Cách dùng:
 *   node scripts/optimize-tour-images.mjs           # chạy tối ưu
 *   node scripts/optimize-tour-images.mjs --dry     # chỉ in báo cáo, không ghi đè
 *   node scripts/optimize-tour-images.mjs --restore # khôi phục từ backup
 *
 * Quy tắc:
 *   - Resize: cạnh dài tối đa 1920px (giữ aspect ratio), không phóng to ảnh nhỏ hơn
 *   - Encode: WebP quality 82 (mặc định smart subsample on)
 *   - Backup: copy nguyên trạng sang public/tours.backup/ trước khi ghi đè
 *   - Bỏ qua: file đã <= 500KB và <= 1920px (đã đủ nhẹ rồi)
 */

import { readdir, stat, mkdir, copyFile, readFile, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT     = join(__dirname, '..');
const SRC_DIR  = join(ROOT, 'public', 'tours');
const BAK_DIR  = join(ROOT, 'public', 'tours.backup');

const MAX_DIM      = 1920;
const WEBP_QUALITY = 82;
const SKIP_IF_SIZE = 500 * 1024; // 500KB

const args = new Set(process.argv.slice(2));
const isDry     = args.has('--dry');
const isRestore = args.has('--restore');

const IMG_EXT = /\.(webp|jpg|jpeg|png)$/i;

function fmt(bytes) {
  if (bytes < 1024) return bytes + 'B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + 'KB';
  return (bytes / 1024 / 1024).toFixed(2) + 'MB';
}

async function walk(dir) {
  const out = [];
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) out.push(...await walk(p));
    else if (IMG_EXT.test(ent.name)) out.push(p);
  }
  return out;
}

async function backupOnce(file) {
  const rel = relative(SRC_DIR, file);
  const dst = join(BAK_DIR, rel);
  if (existsSync(dst)) return; // đã backup rồi → không ghi đè backup
  await mkdir(dirname(dst), { recursive: true });
  await copyFile(file, dst);
}

async function restoreFromBackup() {
  if (!existsSync(BAK_DIR)) {
    console.log('Không có thư mục backup tại', BAK_DIR);
    return;
  }
  const files = await walk(BAK_DIR);
  console.log(`Khôi phục ${files.length} file từ backup...`);
  for (const f of files) {
    const rel = relative(BAK_DIR, f);
    const dst = join(SRC_DIR, rel);
    await mkdir(dirname(dst), { recursive: true });
    await copyFile(f, dst);
  }
  console.log('Xong. Bạn có thể xóa thủ công public/tours.backup/ nếu muốn.');
}

async function optimize() {
  if (!existsSync(SRC_DIR)) {
    console.error('Không tìm thấy', SRC_DIR);
    process.exit(1);
  }

  const files = await walk(SRC_DIR);
  console.log(`Tìm thấy ${files.length} ảnh trong public/tours/`);
  console.log(`Mode: ${isDry ? 'DRY RUN (không ghi đè)' : 'GHI ĐÈ'}`);
  console.log(`Quality: q${WEBP_QUALITY}, max ${MAX_DIM}px cạnh dài\n`);

  let totalBefore = 0, totalAfter = 0, skipped = 0, processed = 0, errors = 0;
  const perTour = new Map();

  for (const file of files) {
    const rel = relative(SRC_DIR, file);
    const tour = rel.split('/')[0];
    if (!perTour.has(tour)) perTour.set(tour, { before: 0, after: 0, count: 0 });

    try {
      const st = await stat(file);
      const meta = await sharp(file).metadata();
      const maxSide = Math.max(meta.width || 0, meta.height || 0);
      totalBefore += st.size;
      perTour.get(tour).before += st.size;
      perTour.get(tour).count++;

      // Bỏ qua nếu đã nhẹ và dimension đã hợp lý
      if (st.size <= SKIP_IF_SIZE && maxSide <= MAX_DIM) {
        skipped++;
        totalAfter += st.size;
        perTour.get(tour).after += st.size;
        continue;
      }

      // Encode buffer mới
      const buf = await sharp(file)
        .resize({
          width:  meta.width  >= meta.height ? MAX_DIM : null,
          height: meta.height > meta.width  ? MAX_DIM : null,
          withoutEnlargement: true,
          fit: 'inside',
        })
        .webp({ quality: WEBP_QUALITY, effort: 5 })
        .toBuffer();

      totalAfter += buf.length;
      perTour.get(tour).after += buf.length;
      processed++;

      const pct = ((1 - buf.length / st.size) * 100).toFixed(0);
      console.log(`  ${rel.padEnd(50)} ${fmt(st.size).padStart(8)} → ${fmt(buf.length).padStart(8)} (-${pct}%)`);

      if (!isDry) {
        await backupOnce(file);
        // Ghi đè cùng filename — đều là .webp nên không đổi extension
        await writeFile(file, buf);
      }
    } catch (err) {
      console.error(`  LỖI ${rel}:`, err.message);
      errors++;
    }
  }

  console.log('\n— Theo tour —');
  for (const [tour, s] of perTour) {
    const pct = s.before ? ((1 - s.after / s.before) * 100).toFixed(0) : '0';
    console.log(`  ${tour.padEnd(28)} ${String(s.count).padStart(3)} ảnh  ${fmt(s.before).padStart(8)} → ${fmt(s.after).padStart(8)}  (-${pct}%)`);
  }

  console.log('\n— Tổng —');
  console.log(`  Xử lý:    ${processed}`);
  console.log(`  Bỏ qua:   ${skipped} (đã đủ nhẹ)`);
  console.log(`  Lỗi:      ${errors}`);
  console.log(`  Trước:    ${fmt(totalBefore)}`);
  console.log(`  Sau:      ${fmt(totalAfter)}`);
  const pct = totalBefore ? ((1 - totalAfter / totalBefore) * 100).toFixed(1) : '0';
  console.log(`  Tiết kiệm: -${pct}% (${fmt(totalBefore - totalAfter)})`);
  if (!isDry) console.log(`\n  Backup tại: public/tours.backup/`);
  if (isDry)  console.log(`\n  (Dry run — không có gì bị thay đổi)`);
}

if (isRestore) {
  await restoreFromBackup();
} else {
  await optimize();
}
