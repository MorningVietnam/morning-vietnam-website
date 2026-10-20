import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    category: z.enum(['travel-guides', 'deep-culture', 'behind-the-tour']),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    readTime: z.number().positive(),
    coverImage: z.string(),
    author: z.object({
      name: z.string(),
      role: z.string().optional(),
      avatar: z.string().optional(),
      quote: z.string().optional(),
    }),
    tags: z.array(z.string()).default([]),
    relatedTourSlug: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
