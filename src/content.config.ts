import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.enum(['research', 'cve', 'ctf', 'technique']),
    excerpt: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    // optional, category-specific
    cve: z.string().optional(),
    platform: z.string().optional(),
    difficulty: z.string().optional(),
    updated: z.coerce.date().optional(),
  }),
});

export const collections = { posts };
