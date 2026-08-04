# CLAUDE.md — Hướng dẫn làm việc trên dự án Morning Vietnam Web

> File này được đọc tự động mỗi session. Mục tiêu: nắm nhanh dự án, sửa đúng file,
> không phá vỡ hệ thiết kế. Trả lời và giải thích **bằng tiếng Việt**.

---

## 1. Dự án là gì

Website chính thức của **Morning Vietnam** — công ty inbound tour, bán tour trải
nghiệm tại Việt Nam cho khách quốc tế (đi sâu thiên nhiên, văn hoá, lịch sử, dân tộc).

- **Live tại:** https://morningvietnam.co
- **Khách target:** quốc tế, chủ yếu EN / FR / DE (testimonial từ Pháp, Đức, Bỉ)
- **Giai đoạn:** đang R&D + bắt đầu bán. Mục tiêu hiện tại là tạo độ phủ, đưa
  thông tin sản phẩm ra thị trường.

**Lưu ý quan trọng về người dùng:** chủ dự án (Thế Anh, co-founder) **không biết lập
trình**. Khi sửa code, luôn giải thích thay đổi bằng ngôn ngữ dễ hiểu, nói rõ file
nào bị động đến và tác động ra sao. Không giả định kiến thức kỹ thuật.

---

## 2. Tech stack

- **Astro 6** (static site generator) + **TypeScript**. Không React/Vue — chỉ
  file `.astro` thuần và data `.ts`.
- Build ra HTML tĩnh trong `/dist`. **Auto-deploy** đã thiết lập (push lên git là
  deploy).
- Yêu cầu Node >= 22.12.

**Lệnh chính** (chạy từ gốc dự án):

| Lệnh             | Tác dụng                                  |
| :--------------- | :---------------------------------------- |
| `npm run dev`    | Chạy server local tại localhost:4321      |
| `npm run build`  | Build ra `/dist` — **luôn chạy để kiểm tra trước khi báo xong** |
| `npm run preview`| Xem bản build trước khi deploy            |

---

## 3. Bản đồ file — sửa gì ở đâu

```
src/
├── data/
│   └── tours.ts          ← TOÀN BỘ nội dung tour: tên, giá, lịch trình,
│                            gallery, FAQ, mùa, elevation… Sửa tour ở ĐÂY.
├── pages/                ← Mỗi file = 1 trang (route theo tên file)
│   ├── index.astro         trang chủ
│   ├── contact.astro       trang liên hệ
│   ├── tours/
│   │   ├── index.astro     danh sách tour
│   │   └── [slug].astro    template trang chi tiết 1 tour (tự sinh từ tours.ts)
│   ├── explore/
│   │   ├── about.astro     về chúng tôi + team
│   │   ├── faq.astro
│   │   └── vietnam-facts.astro
│   ├── privacy-policy.astro
│   └── terms-and-conditions.astro
├── layouts/
│   ├── BaseLayout.astro    ← khung chung (head, SEO meta, Header, Footer)
│   └── ExploreLayout.astro
├── components/             ← khối tái dùng
│   ├── Header.astro, Footer.astro
│   ├── TourCard.astro      thẻ tour ở trang danh sách
│   ├── ContactForm.astro
│   ├── NotifyPopup.astro   popup "Notify me" cho tour coming-soon
│   └── Marquee.astro
├── styles/
│   ├── variables.css       ← design tokens (màu, font, spacing) — NGUỒN SỰ THẬT
│   ├── global.css          reset + base + import font
│   └── animations.css
└── scripts/main.js         JS phía client
```

**Quy tắc vàng:** sửa nội dung tour → `src/data/tours.ts`, không sửa thẳng vào
`[slug].astro`. Trang chi tiết tự render từ data.

---

## 4. Design system — KHÔNG được phá

Tất cả màu/font/spacing nằm trong `src/styles/variables.css`. **Luôn dùng CSS
variables, không hardcode giá trị.**

**Bảng màu thương hiệu:**

| Token                  | Mã        | Vai trò                          |
| :--------------------- | :-------- | :------------------------------- |
| `--color-java`         | `#1da0a0` | Teal chủ đạo — ~60% sử dụng       |
| `--color-riptide` / `--color-light-cyan` | `#7de2d1` / `#d9f7f5` | Phụ — ~40%   |
| `--color-nordic`       | `#043341` | Tối — chữ / nền                  |
| `--color-sorbus`       | `#ea6739` | Cam accent — **CHỈ cho CTA, ~10%** |
| `--color-white-nectar` | `#f7f3d9` | Nền sáng                         |

→ Cam Sorbus chỉ dùng cho nút hành động chính (CTA). Đừng lạm dụng.

**Font:** heading `Commissioner`, body `Google Sans / Product Sans`. Đã import
trong `global.css`.

**Spacing / radius / shadow:** dùng các token `--space-*`, `--radius-*`,
`--shadow-*`. Có cả alias legacy (`--space-4`, `--text-lg`…) cho component cũ.

---

## 5. Brand voice & định vị (giữ nhất quán mọi nội dung EN)

- **Tagline:** *"Vietnam deeper. Horizons wider."*
- **4 trụ định vị:**
  - Small group — **tối đa 8 người**, không gộp nhóm.
  - **Local hosts, không phải "tour guides"** — ngôn ngữ phải phản ánh điều này.
  - **"Unlock challenge"** — format signature, team challenge tại các khoảnh khắc
    văn hoá. Đây là điểm khác biệt cốt lõi, luôn nhấn.
  - **No payment upfront** — giữ chỗ trước, trả sau, huỷ free đến 14 ngày trước.
- **Tone:** ấm, phiêu lưu, thật, "from strangers to family". Tránh giọng tour
  công nghiệp / brochure sáo rỗng.
- **Ngôn ngữ website:** tiếng Anh (chính), có nhắc EN / FR / DE.

**Pháp lý (giữ nguyên ở footer):** Travel agency license
`01-3135/2026/CDLQGVN-GP LHQT`. © 2026 Morning Vietnam Co. Ltd.

---

## 6. Sản phẩm hiện tại (trong `tours.ts`)

9 tour. North đang bán, Central/South "coming soon" (dự kiến Q3/Q4 2026).

- **Live (North):** Ho Chi Minh: A Life, Lai Châu Motortour, Unlock Mai Châu,
  Mai Mộc in 1 Trip
- **Coming soon (North):** Ninh Bình in a New Way, Cát Bà Not Just Sea
- **Coming soon (region "soon"):** Central Vietnam, Central Highlands, Mekong Delta

`comingSoon: true` → hiển thị popup "Notify me" thay vì cho đặt.

---

## 6b. Đa ngôn ngữ (i18n)

Website hỗ trợ nhiều ngôn ngữ theo kiểu **subpath**. Chi tiết đầy đủ ở
`src/i18n/README.md` — đọc file đó trước khi đụng vào phần đa ngôn ngữ.

- **EN là mặc định, KHÔNG có tiền tố** (`/tours`) → giữ nguyên toàn bộ SEO cũ.
  Tuyệt đối không đổi sang `/en/`.
- **VI ở `/vi/`** (`/vi/tours`).
- `src/i18n/config.ts` — khai báo ngôn ngữ + mảng `VI_ROUTES` (danh sách trang
  đã dịch). **Dịch xong trang nào phải thêm vào `VI_ROUTES`**, nếu không nút
  chuyển ngôn ngữ và hreflang sẽ bỏ qua trang đó.
- `src/i18n/ui.ts` — từ điển chuỗi giao diện (menu, nút, footer). Không đổi tên khoá.
- `src/components/LangSwitcher.astro` — nút chọn ngôn ngữ, tự đọc danh sách từ
  config, không cần sửa khi thêm ngôn ngữ.
- Header/Footer dùng `navPath()` cho mọi link nội bộ → trang chưa dịch tự trỏ
  về bản EN thay vì 404.
- `BaseLayout.astro` tự sinh `hreflang` + `og:locale` + `<html lang>`.

**Trạng thái:** mới có `/vi` (trang chủ). Chưa có `src/data/tours.vi.ts` —
không tự bịa nội dung/giá tour tiếng Việt khi chưa được duyệt.

## 7. Việc còn dang dở (TODO trong code)

Khi đụng tới các phần này, lưu ý chúng **chưa hoàn thiện**:

- **Formspree chưa cấu hình:** `NotifyPopup.astro` còn `FORMSPREE_ID = 'YOUR_FORMSPREE_ID'`.
  Cần thay bằng form ID thật để nhận đăng ký waitlist (xem README).
- **Google Tag Manager / Meta Pixel chưa bật:** trong `BaseLayout.astro` còn
  `GTM-XXXXXXX` (đang comment). Cần ID thật trước khi chạy ads/tracking.
- **`src/pages/index.astro` đang có thay đổi chưa commit** (tại thời điểm viết file này).

---

## 8. Quy tắc làm việc

1. **`git status` trước khi sửa** — biết đang có gì chưa commit, tránh ghi đè.
2. **`npm run build` trước khi báo xong** — không tự nhận hoàn thành nếu build lỗi.
3. **Không tự ý đổi giá / nội dung tour / thông tin pháp lý** khi chưa được xác nhận.
4. **Hỏi khi thiếu thông tin**, không đoán mò (đặc biệt giá, ngày, số liệu).
5. Trình bày **đủ sâu, súc tích, thẳng thắn**; phản biện khi thấy quyết định có rủi ro.
6. Mọi giải thích bằng **tiếng Việt**, thuật ngữ kỹ thuật giữ tiếng Anh nhưng hạn chế.
