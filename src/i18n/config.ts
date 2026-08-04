/**
 * config.ts — Trung tâm điều khiển đa ngôn ngữ của Morning Vietnam
 * ============================================================================
 *
 * ĐỌC TRƯỚC KHI SỬA (dành cho người không lập trình):
 *
 * File này quyết định website có những ngôn ngữ nào và đường dẫn của từng
 * ngôn ngữ ra sao. Có 2 chỗ anh sẽ đụng tới thường xuyên:
 *
 *   1. LANGUAGES  → thêm/bớt ngôn ngữ (sau này thêm 'fr', 'de')
 *   2. VI_ROUTES  → MỖI KHI DỊCH XONG 1 TRANG SANG TIẾNG VIỆT,
 *                   THÊM ĐƯỜNG DẪN CỦA TRANG ĐÓ VÀO ĐÂY.
 *
 * Vì sao cần VI_ROUTES? Nút chuyển ngôn ngữ cần biết trang hiện tại ĐÃ có bản
 * tiếng Việt hay chưa. Nếu chưa mà vẫn cho bấm, khách sẽ rơi vào trang lỗi 404.
 * Danh sách này giúp nút tự động chuyển về trang chủ tiếng Việt thay vì lỗi.
 *
 * ── Cấu trúc URL ───────────────────────────────────────────────────────────
 *   Tiếng Anh (mặc định) : morningvietnam.co/tours
 *   Tiếng Việt           : morningvietnam.co/vi/tours
 *
 * Tiếng Anh KHÔNG có tiền tố → toàn bộ link cũ, backlink, kết quả Google đã có
 * vẫn chạy y nguyên. Đây là lý do chọn kiểu này thay vì /en/tours.
 */

// ── 1. Danh sách ngôn ngữ ───────────────────────────────────────────────────

export const DEFAULT_LANG = 'en' as const;

export type Lang = 'en' | 'vi';

export interface LangInfo {
  /** Mã hiển thị trên nút bấm */
  code: string;
  /** Tên đầy đủ, hiện trong menu chọn ngôn ngữ */
  label: string;
  /** Tên ngôn ngữ viết bằng chính ngôn ngữ đó (chuẩn UX quốc tế) */
  nativeName: string;
  /** Dùng cho thẻ <html lang="..."> và hreflang — Google đọc thẻ này */
  htmlLang: string;
  /** Dùng cho thẻ og:locale khi share lên Facebook */
  ogLocale: string;
}

export const LANGUAGES: Record<Lang, LangInfo> = {
  en: {
    code: 'EN',
    label: 'English',
    nativeName: 'English',
    htmlLang: 'en',
    ogLocale: 'en_US',
  },
  vi: {
    code: 'VI',
    label: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    htmlLang: 'vi',
    ogLocale: 'vi_VN',
  },
  // Sau này thêm tiếng Pháp / Đức thì bỏ comment và làm y hệt:
  // fr: { code: 'FR', label: 'French', nativeName: 'Français', htmlLang: 'fr', ogLocale: 'fr_FR' },
  // de: { code: 'DE', label: 'German', nativeName: 'Deutsch', htmlLang: 'de', ogLocale: 'de_DE' },
};

/** Mảng mã ngôn ngữ, dùng để lặp trong component */
export const LANG_CODES = Object.keys(LANGUAGES) as Lang[];

/** Các ngôn ngữ có tiền tố trong URL (tất cả trừ ngôn ngữ mặc định) */
const PREFIXED_LANGS = LANG_CODES.filter((l) => l !== DEFAULT_LANG);

// ── 2. Danh sách trang ĐÃ có bản tiếng Việt ─────────────────────────────────
//
// ⚠️  MỖI LẦN DỊCH XONG 1 TRANG, THÊM ĐƯỜNG DẪN VÀO MẢNG NÀY.
//     Viết đường dẫn phiên bản TIẾNG ANH, không cần '/vi'.
//     Ví dụ: dịch xong trang /explore/about → thêm '/explore/about'
//
// Dấu '*' ở cuối nghĩa là "mọi trang con". Ví dụ '/tours/*' = tất cả trang
// chi tiết tour. Chỉ dùng khi CHẮC CHẮN đã dịch hết nhóm đó.

export const VI_ROUTES: string[] = [
  '/', // trang chủ
];

/**
 * Kiểm tra một đường dẫn đã có bản tiếng Việt chưa.
 * @param path đường dẫn bản tiếng Anh, ví dụ '/tours' hoặc '/explore/about'
 */
export function hasViVersion(path: string): boolean {
  const clean = normalizePath(path);
  return VI_ROUTES.some((route) => {
    if (route.endsWith('/*')) {
      const base = route.slice(0, -2);
      return clean === base || clean.startsWith(base + '/');
    }
    return normalizePath(route) === clean;
  });
}

// ── 3. Các hàm xử lý đường dẫn ──────────────────────────────────────────────

/** Chuẩn hoá: bỏ dấu '/' thừa ở cuối. '/tours/' → '/tours', '/' giữ nguyên */
export function normalizePath(path: string): string {
  if (!path.startsWith('/')) path = '/' + path;
  return path === '/' ? '/' : path.replace(/\/+$/, '');
}

/**
 * Đọc ngôn ngữ từ đường dẫn hiện tại.
 * '/vi/tours' → 'vi'   |   '/tours' → 'en'
 */
export function getLangFromPath(pathname: string): Lang {
  const seg = normalizePath(pathname).split('/')[1];
  return (PREFIXED_LANGS as string[]).includes(seg) ? (seg as Lang) : DEFAULT_LANG;
}

/**
 * Gỡ tiền tố ngôn ngữ, trả về đường dẫn "gốc" (bản tiếng Anh).
 * '/vi/tours' → '/tours'   |   '/vi' → '/'   |   '/tours' → '/tours'
 */
export function stripLang(pathname: string): string {
  const clean = normalizePath(pathname);
  for (const lang of PREFIXED_LANGS) {
    if (clean === `/${lang}`) return '/';
    if (clean.startsWith(`/${lang}/`)) return clean.slice(lang.length + 1);
  }
  return clean;
}

/**
 * Dựng đường dẫn cho một ngôn ngữ cụ thể.
 * localizePath('/tours', 'vi') → '/vi/tours'
 * localizePath('/tours', 'en') → '/tours'
 *
 * Dùng hàm này cho MỌI link nội bộ trong Header, Footer, nút CTA — để link
 * tự đổi theo ngôn ngữ khách đang xem, không bị nhảy ngược về bản tiếng Anh.
 */
export function localizePath(path: string, lang: Lang): string {
  const base = stripLang(path);
  if (lang === DEFAULT_LANG) return base;
  return base === '/' ? `/${lang}` : `/${lang}${base}`;
}

/**
 * Đường dẫn AN TOÀN cho link trong menu / footer.
 *
 * Khác `localizePath` ở chỗ: nếu trang đích CHƯA có bản dịch, hàm này trả về
 * bản tiếng Anh thay vì tạo link tới trang không tồn tại (404).
 *
 * Ví dụ khi khách đang ở /vi mà chưa dịch trang tour:
 *   navPath('/tours', 'vi')   → '/tours'      (tạm về bản EN, không lỗi)
 * Sau khi dịch xong và thêm '/tours' vào VI_ROUTES:
 *   navPath('/tours', 'vi')   → '/vi/tours'   (tự động, không cần sửa gì thêm)
 *
 * → Dùng hàm này cho MỌI link trong Header và Footer.
 */
export function navPath(path: string, lang: Lang): string {
  if (lang === DEFAULT_LANG) return stripLang(path);
  if (lang === 'vi' && !hasViVersion(path)) return stripLang(path);
  return localizePath(path, lang);
}

/**
 * Đường dẫn để nút chuyển ngôn ngữ trỏ tới.
 * Nếu trang hiện tại chưa có bản dịch → trả về trang chủ của ngôn ngữ đó,
 * tránh cho khách rơi vào trang 404.
 */
export function switchLangPath(currentPath: string, target: Lang): string {
  const base = stripLang(currentPath);
  if (target === DEFAULT_LANG) return base;
  if (target === 'vi' && !hasViVersion(base)) return '/vi';
  return localizePath(base, target);
}

/**
 * Danh sách thẻ hreflang cho <head> — báo Google biết trang này có những
 * bản ngôn ngữ nào. Chỉ liệt kê ngôn ngữ THẬT SỰ đã có bản dịch, vì khai báo
 * hreflang trỏ tới trang không tồn tại sẽ bị Google báo lỗi.
 */
export function getAlternates(currentPath: string): { lang: Lang; htmlLang: string; path: string }[] {
  const base = stripLang(currentPath);
  const out: { lang: Lang; htmlLang: string; path: string }[] = [
    { lang: 'en', htmlLang: LANGUAGES.en.htmlLang, path: base },
  ];
  if (hasViVersion(base)) {
    out.push({ lang: 'vi', htmlLang: LANGUAGES.vi.htmlLang, path: localizePath(base, 'vi') });
  }
  return out;
}
