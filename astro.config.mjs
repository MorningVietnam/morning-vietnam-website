// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://morningvietnam.co',

  // ── Đa ngôn ngữ ─────────────────────────────────────────────────────────
  // 'en' là mặc định và KHÔNG có prefix → mọi URL tiếng Anh hiện tại giữ
  // nguyên (/tours, /contact...). Không mất SEO đã có.
  // 'vi' nằm dưới /vi/ (vd: /vi/tours). Thêm ngôn ngữ mới sau này chỉ cần
  // thêm mã vào mảng locales + tạo file từ điển tương ứng trong src/i18n/.
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'vi'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },

  integrations: [
    sitemap({
      // Khai báo ngôn ngữ để sitemap tự sinh thẻ hreflang cho Google —
      // đây là thứ giúp Google hiểu /tours và /vi/tours là cùng 1 trang.
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          vi: 'vi',
        },
      },
      // Loại trừ tour comingSoon (đang R&D, nội dung chưa hoàn chỉnh).
      // /catalogue/* GIỮ LẠI cho SEO B2B ("Vietnam travel agent catalogue").
      filter: (page) => {
        const url = new URL(page);
        // Bỏ tiền tố ngôn ngữ (/vi) để luật lọc áp dụng cho MỌI ngôn ngữ
        const path = url.pathname.replace(/^\/(vi)(?=\/|$)/, '') || '/';
        const comingSoonSlugs = [
          'ninh-binh-in-a-new-way',
          'cat-ba-not-just-sea',
          'central-vietnam',
          'central-highlands',
          'mekong-delta',
        ];
        if (comingSoonSlugs.some(s => path === `/tours/${s}` || path === `/tours/${s}/`)) {
          return false;
        }
        return true;
      },
      // Ưu tiên trang chủ + tours cao hơn trang phụ.
      // Astro sinh URL với trailing slash → strip để compare nhất quán.
      serialize(item) {
        const raw = new URL(item.url).pathname.replace(/^\/(vi)(?=\/|$)/, '') || '/';
        const path = raw === '/' ? '/' : raw.replace(/\/$/, '');
        if (path === '/') {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        } else if (path.startsWith('/tours')) {
          item.priority = 0.9;
          item.changefreq = 'weekly';
        } else if (path.startsWith('/catalogue')) {
          // B2B nhưng vẫn quan trọng cho SEO partner-facing
          item.priority = 0.7;
          item.changefreq = 'monthly';
        } else if (path.startsWith('/explore')) {
          item.priority = 0.7;
          item.changefreq = 'monthly';
        } else if (path === '/contact') {
          item.priority = 0.6;
          item.changefreq = 'monthly';
        } else {
          // privacy-policy, terms-and-conditions
          item.priority = 0.3;
          item.changefreq = 'yearly';
        }
        return item;
      },
    }),
  ],
});
