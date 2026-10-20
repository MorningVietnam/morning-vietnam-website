export const BLOG_CATEGORIES = {
  'travel-guides':   { label: 'Travel Guides',   color: '#1da0a0', description: 'Planning tips, timing, routes.' },
  'deep-culture':    { label: 'Deep Culture',    color: '#a08f1d', description: 'Vietnam you don\'t see on the surface.' },
  'behind-the-tour': { label: 'Behind the Tour', color: '#ea6739', description: 'How and why we built what we built.' },
} as const;

export type BlogCategory = keyof typeof BLOG_CATEGORIES;
