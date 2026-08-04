# Hệ thống đa ngôn ngữ — Morning Vietnam

> Viết cho người **không lập trình**. Đọc file này trước khi nhờ ai sửa nội dung
> đa ngôn ngữ.

---

## 1. Nguyên tắc URL

| Ngôn ngữ | Địa chỉ ví dụ | Ghi chú |
| :------- | :------------ | :------ |
| Tiếng Anh (mặc định) | `morningvietnam.co/tours` | **Không có tiền tố** |
| Tiếng Việt | `morningvietnam.co/vi/tours` | Thêm `/vi` phía trước |
| Pháp (sau này) | `morningvietnam.co/fr/tours` | |
| Đức (sau này) | `morningvietnam.co/de/tours` | |

**Vì sao tiếng Anh không có tiền tố?** Vì mọi link cũ, backlink đối tác, và kết
quả Google đã có đều đang trỏ tới `/tours`. Đổi thành `/en/tours` là mất sạch
thứ hạng đã xây. Đây là quyết định không nên đảo ngược.

---

## 2. Bốn file cần biết

```
src/i18n/
├── config.ts    ← Khai báo ngôn ngữ + DANH SÁCH TRANG ĐÃ DỊCH (hay sửa nhất)
├── ui.ts        ← Chữ ngắn lặp lại: menu, nút, tiêu đề cột footer
└── README.md    ← File anh đang đọc

src/components/
└── LangSwitcher.astro  ← Nút chọn ngôn ngữ. Không cần sửa khi thêm ngôn ngữ.
```

Ngoài ra:

- `src/layouts/BaseLayout.astro` — tự sinh thẻ `hreflang` báo Google biết trang
  có những bản ngôn ngữ nào. Đã xong, không cần đụng.
- `astro.config.mjs` — bật i18n + cho sitemap sinh hreflang. Đã xong.

---

## 3. Nút chuyển ngôn ngữ hoạt động thế nào

Nút nằm ở góc phải thanh nav (desktop) và cuối menu trượt (điện thoại).

Logic tự động, không cần cấu hình:

1. Khách đang ở `/tours`, bấm **Tiếng Việt**
2. Hệ thống kiểm tra: `/tours` đã có bản tiếng Việt chưa?
   - **Rồi** → chuyển tới `/vi/tours` (giữ nguyên trang khách đang xem)
   - **Chưa** → chuyển về `/vi` (trang chủ tiếng Việt), **không để khách rơi vào
     trang lỗi 404**

Cùng logic đó áp dụng cho mọi link trong menu và footer.

---

## 4. Quy trình dịch thêm 1 trang — 3 bước

Ví dụ: dịch trang **Tours** (`/tours`) sang tiếng Việt.

### Bước 1 — Tạo file trang tiếng Việt

Sao chép `src/pages/tours/index.astro` thành `src/pages/vi/tours/index.astro`,
rồi thay toàn bộ chữ tiếng Anh trong đó bằng tiếng Việt.

> Cấu trúc thư mục phải khớp: `/vi/tours` ↔ `src/pages/vi/tours/index.astro`

### Bước 2 — Khai báo là đã dịch xong

Mở `src/i18n/config.ts`, tìm mảng `VI_ROUTES`, thêm đường dẫn **bản tiếng Anh**:

```ts
export const VI_ROUTES: string[] = [
  '/',
  '/tours',        // ← thêm dòng này
];
```

Đây là bước **hay bị quên nhất**. Bỏ qua bước này thì trang tiếng Việt vẫn tồn
tại nhưng nút chuyển ngôn ngữ không dẫn tới, Google cũng không biết nó có.

### Bước 3 — Kiểm tra

Chạy `npm run build`. Nếu không báo lỗi là xong.

---

## 5. Sửa chữ trong menu / footer

Mở `src/i18n/ui.ts`. Mỗi dòng có dạng:

```ts
'nav.tours': 'Tour',
```

- Phần bên **trái** (`'nav.tours'`) là **khoá** — TUYỆT ĐỐI không đổi, đổi là
  web build lỗi.
- Phần bên **phải** (`'Tour'`) là chữ hiển thị — sửa thoải mái.

Trong file có đánh dấu `⚠️ DUYỆT` ở những chỗ cần Thế Anh quyết định giọng
thương hiệu tiếng Việt.

---

## 6. Thêm ngôn ngữ mới (Pháp / Đức)

1. `astro.config.mjs` → thêm `'fr'` vào `locales` **và** vào `sitemap.i18n.locales`
2. `src/i18n/config.ts` → thêm `fr` vào `LANGUAGES` và mở rộng kiểu `Lang`
3. `src/i18n/ui.ts` → thêm khối `fr: { ... }` dịch toàn bộ khoá
4. Tạo thư mục `src/pages/fr/` và các trang tương ứng

Nút chuyển ngôn ngữ **tự động** hiện thêm lựa chọn mới, không cần sửa.

---

## 7. Ba lỗi hay gặp

| Triệu chứng | Nguyên nhân | Cách sửa |
| :---------- | :---------- | :------- |
| Bấm nút VI nhưng luôn về trang chủ | Trang đó chưa khai báo trong `VI_ROUTES` | Thêm đường dẫn vào `VI_ROUTES` |
| Trang tiếng Việt nhưng menu vẫn tiếng Anh | Thiếu bản dịch trong `ui.ts` — hệ thống tự lấy tiếng Anh thay thế | Bổ sung khoá còn thiếu vào khối `vi` |
| Build báo lỗi sau khi sửa `ui.ts` | Đã lỡ đổi tên **khoá** thay vì đổi chữ hiển thị | Khôi phục đúng tên khoá |

---

## 8. Còn dang dở

- **Chỉ trang chủ `/vi` đã dịch.** Toàn bộ trang còn lại vẫn tiếng Anh.
- **Chưa có nội dung tour tiếng Việt.** Cần tạo `src/data/tours.vi.ts` sau khi
  Thế Anh duyệt tên tour, giá VNĐ và mô tả — hiện tại cố tình để trống thay vì
  tự bịa.
- **Chưa quyết định** có Việt hoá `Say "Morning!"` và tagline hay không —
  xem dấu `⚠️ DUYỆT` trong `ui.ts`.
