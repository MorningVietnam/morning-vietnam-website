// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://morningvietnam.co',
  integrations: [
    sitemap({
      // Loại trừ tour comingSoon (đang R&D, nội dung chưa hoàn chỉnh).
      // /catalogue/* GIỮ LẠI cho SEO B2B ("Vietnam travel agent catalogue").
      filter: (page) => {
        const url = new URL(page);
        const path = url.pathname;
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
      // Ưu tiên trang chủ + tours cao hơn trang phụ
      serialize(item) {
        const path = new URL(item.url).pathname;
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
