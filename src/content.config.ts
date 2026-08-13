import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const guides = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    image: z.string(),
    imageAlt: z.string(),
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    category: z.enum(['svg-tools', 'developer-tools', 'seo-tools']),
    relatedTools: z.array(z.string()).default([]),
    faqs: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        })
      )
      .default([]),
  }),
});

export const collections = { guides };