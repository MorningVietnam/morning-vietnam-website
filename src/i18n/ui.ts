/**
 * ui.ts — Từ điển chuỗi giao diện (Header, Footer, nút bấm dùng lại nhiều nơi)
 * ============================================================================
 *
 * CÁCH DÙNG (dành cho người không lập trình):
 *
 * Mỗi dòng có dạng    'khoá': 'chữ hiển thị'
 * Anh chỉ sửa phần    'chữ hiển thị'    — TUYỆT ĐỐI không đổi phần 'khoá'.
 * Đổi khoá sẽ làm web build lỗi.
 *
 * File này CHỈ chứa chữ ngắn lặp lại (menu, nút, tiêu đề cột footer).
 * Nội dung dài của từng trang (trang chủ, tour, about...) nằm ở chỗ khác —
 * xem src/i18n/README.md.
 *
 * ⚠️  BA CHỖ CẦN THẾ ANH DUYỆT — em để bản gợi ý, anh sửa lại nếu chưa ưng:
 *     1. tagline      — 'Vietnam deeper. Horizons wider.' dịch sang VI
 *     2. ctaBook      — 'Say "Morning!"' có nên giữ nguyên tiếng Anh không
 *     3. marquee.*    — băng chữ chạy trên đầu trang
 */

import type { Lang } from './config';

export const ui = {
  // ══════════════════════════════════════════════════════════════════════════
  en: {
    // ── Thanh điều hướng ──
    'nav.explore': 'Explore',
    'nav.tours': 'Tours',
    'nav.partners': 'For Partners',
    'nav.contact': 'Contact',

    'nav.about': 'About Us',
    'nav.about.desc': 'Our story & the team',
    'nav.facts': 'Vietnam Facts',
    'nav.facts.desc': '54 ethnicities. 3,260km coastline.',
    'nav.faq': 'FAQ',
    'nav.faq.desc': 'Everything you need to know',
    'nav.travelGuide': 'Travel Guide',
    'nav.travelGuide.desc': 'Visas, money, SIM cards & more',
    'nav.catalogue': 'Catalogue',
    'nav.catalogue.desc': 'Destination brochures for agents',
    'nav.partnerWithUs': 'Partner with us',
    'nav.partnerWithUs.desc': 'Pricing & commission — get in touch',

    // ── Nút hành động chính ──
    'cta.book': 'Say "Morning!"',

    // ── Nút chuyển ngôn ngữ ──
    'lang.label': 'Change language',
    'lang.current': 'Language',

    // ── Menu di động ──
    'mobile.open': 'Open navigation menu',
    'mobile.close': 'Close navigation menu',

    // ── Băng chữ chạy trên đầu ──
    'marquee.1': 'Vietnam deeper. Horizons wider.',
    'marquee.2': 'Small groups. Real moments.',
    'marquee.3': 'Licensed tour operator',
    'marquee.4': 'From strangers to family',
    'marquee.5': 'Active but accessible',
    'marquee.6': 'EN / FR / DE',

    // ── Footer ──
    'footer.heading.line1': 'Vietnam deeper.',
    'footer.heading.line2': 'Horizons wider.',
    'footer.sub': 'Join the list — first dibs on new tours, real stories from the road.',
    'footer.emailLabel': 'Email address',
    'footer.emailPlaceholder': 'your@email.com',
    'footer.subscribe': 'Subscribe',
    'footer.subscribed': "You're on the list ✓",

    'footer.col.tours': 'Tours',
    'footer.allTours': 'All tours',
    'footer.north': 'North Vietnam',
    'footer.comingSoon': 'Coming soon',

    'footer.col.explore': 'Explore',
    'footer.aboutUs': 'About us',
    'footer.vietnamFacts': 'Vietnam facts',
    'footer.faq': 'FAQ',
    'footer.travelGuide': 'Travel guide',

    'footer.col.help': 'Help',
    'footer.contact': 'Contact',
    'footer.emailUs': 'Email us',
    'footer.whatsapp': 'WhatsApp',
    'footer.catalogueB2B': 'Catalogue (B2B)',

    'footer.col.socials': 'Socials',

    'footer.license': 'Travel agency business license number:',
    'footer.rights': 'All rights reserved.',
    'footer.privacy': 'Privacy policy',
    'footer.terms': 'Terms & conditions',
  },

  // ══════════════════════════════════════════════════════════════════════════
  vi: {
    // ── Thanh điều hướng ──
    'nav.explore': 'Khám phá',
    'nav.tours': 'Tour',
    'nav.partners': 'Đối tác',
    'nav.contact': 'Liên hệ',

    'nav.about': 'Về chúng tôi',
    'nav.about.desc': 'Câu chuyện & đội ngũ',
    'nav.facts': 'Việt Nam có gì',
    'nav.facts.desc': '54 dân tộc. 3.260km bờ biển.',
    'nav.faq': 'Câu hỏi thường gặp',
    'nav.faq.desc': 'Những điều bạn cần biết',
    'nav.travelGuide': 'Cẩm nang du lịch',
    'nav.travelGuide.desc': 'Visa, tiền tệ, SIM card & hơn thế',
    'nav.catalogue': 'Catalogue',
    'nav.catalogue.desc': 'Brochure điểm đến cho đại lý',
    'nav.partnerWithUs': 'Hợp tác cùng chúng tôi',
    'nav.partnerWithUs.desc': 'Giá & hoa hồng — liên hệ ngay',

    // ── Nút hành động chính ──
    // ⚠️ DUYỆT: giữ nguyên tiếng Anh vì đây là chữ ký thương hiệu.
    //    Nếu anh muốn Việt hoá, gợi ý: 'Chào Morning!' hoặc 'Bắt đầu chuyến đi'
    'cta.book': 'Say "Morning!"',

    // ── Nút chuyển ngôn ngữ ──
    'lang.label': 'Đổi ngôn ngữ',
    'lang.current': 'Ngôn ngữ',

    // ── Menu di động ──
    'mobile.open': 'Mở menu',
    'mobile.close': 'Đóng menu',

    // ── Băng chữ chạy trên đầu ──
    // ⚠️ DUYỆT: đây là chỗ đặt giọng thương hiệu tiếng Việt. Anh đọc kỹ.
    'marquee.1': 'Việt Nam sâu hơn. Chân trời rộng hơn.',
    'marquee.2': 'Nhóm nhỏ. Khoảnh khắc thật.',
    'marquee.3': 'Công ty lữ hành có giấy phép',
    'marquee.4': 'Từ người lạ thành người nhà',
    'marquee.5': 'Vận động nhưng ai cũng theo được',
    'marquee.6': 'EN / FR / DE / VI',

    // ── Footer ──
    'footer.heading.line1': 'Việt Nam sâu hơn.',
    'footer.heading.line2': 'Chân trời rộng hơn.',
    'footer.sub': 'Đăng ký nhận tin — biết tour mới sớm nhất, đọc chuyện thật từ đường đi.',
    'footer.emailLabel': 'Địa chỉ email',
    'footer.emailPlaceholder': 'email@cuaban.com',
    'footer.subscribe': 'Đăng ký',
    'footer.subscribed': 'Đã đăng ký thành công ✓',

    'footer.col.tours': 'Tour',
    'footer.allTours': 'Tất cả tour',
    'footer.north': 'Miền Bắc',
    'footer.comingSoon': 'Sắp ra mắt',

    'footer.col.explore': 'Khám phá',
    'footer.aboutUs': 'Về chúng tôi',
    'footer.vietnamFacts': 'Việt Nam có gì',
    'footer.faq': 'Câu hỏi thường gặp',
    'footer.travelGuide': 'Cẩm nang du lịch',

    'footer.col.help': 'Hỗ trợ',
    'footer.contact': 'Liên hệ',
    'footer.emailUs': 'Gửi email',
    'footer.whatsapp': 'WhatsApp',
    'footer.catalogueB2B': 'Catalogue (B2B)',

    'footer.col.socials': 'Mạng xã hội',

    'footer.license': 'Giấy phép kinh doanh lữ hành quốc tế số:',
    'footer.rights': 'Bảo lưu mọi quyền.',
    'footer.privacy': 'Chính sách bảo mật',
    'footer.terms': 'Điều khoản & điều kiện',
  },
} as const;

/** Kiểu khoá — giúp báo lỗi ngay khi build nếu gõ sai tên khoá */
export type UIKey = keyof (typeof ui)['en'];

/**
 * Lấy hàm dịch cho một ngôn ngữ.
 *
 * Dùng trong file .astro:
 *     const t = useTranslations(lang);
 *     <a href="...">{t('nav.tours')}</a>
 *
 * Nếu ngôn ngữ nào đó thiếu một chuỗi, hệ thống tự lấy bản tiếng Anh thay thế
 * (fallback) — web không bao giờ hiện ô trống.
 */
export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    const dict = ui[lang] as Record<string, string> | undefined;
    return dict?.[key] ?? (ui.en as Record<string, string>)[key] ?? key;
  };
}
