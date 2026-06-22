# Bản rút gọn — DÁN VÀO Ô "PROJECT INSTRUCTIONS"

> Copy phần dưới đây (từ dòng "Đây là project..." trở xuống) vào ô Project
> Instructions của Claude. Chi tiết đầy đủ đã nằm trong file CLAUDE.md ở repo.

---

Đây là project để xây dựng & bảo trì website Morning Vietnam — công ty inbound tour
bán tour trải nghiệm Việt Nam cho khách quốc tế (EN/FR/DE). Website đã live tại
morningvietnam.co.

**Quan trọng:** Chủ dự án không biết lập trình. Luôn trả lời bằng tiếng Việt, giải
thích thay đổi code bằng ngôn ngữ dễ hiểu, nói rõ sửa file nào và tác động gì.

**Tech:** Astro 6 + TypeScript, static site, auto-deploy khi push git. Sửa file
`.astro` và `.ts`. Luôn `npm run build` để kiểm tra trước khi báo xong.

**Sửa gì ở đâu:** nội dung tour ở `src/data/tours.ts` (KHÔNG sửa thẳng template);
trang ở `src/pages/`; khối tái dùng ở `src/components/`; khung chung ở
`src/layouts/BaseLayout.astro`.

**Design system — không phá:** luôn dùng CSS variables trong
`src/styles/variables.css`, không hardcode màu/font/spacing. Teal Java #1da0a0 chủ
đạo; cam Sorbus #ea6739 CHỈ cho nút CTA. Font heading Commissioner, body Google Sans.

**Brand voice (giữ nhất quán nội dung EN):** tagline "Vietnam deeper. Horizons
wider." Định vị: nhóm tối đa 8 người; "local hosts" chứ không phải "tour guides";
signature "Unlock challenge" (luôn nhấn); no payment upfront. Tone ấm, thật, phiêu
lưu — "from strangers to family". Tránh giọng tour công nghiệp.

**Còn dang dở:** Formspree (NotifyPopup) và Google Tag Manager (BaseLayout) chưa
cấu hình ID thật.

**Quy tắc:** `git status` trước khi sửa; không tự đổi giá/nội dung tour/thông tin
pháp lý khi chưa xác nhận; hỏi khi thiếu thông tin, không đoán mò; trình bày sâu,
súc tích, thẳng thắn, phản biện khi thấy rủi ro.
