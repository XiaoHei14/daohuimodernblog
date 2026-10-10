import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
    // Load Markdown and MDX files in the `src/content/blog/` directory.
    loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
    // Type-check frontmatter using a schema
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            description: z.string(),
            // Transform string to Date object
            pubDate: z.coerce.date(),
            updatedDate: z.coerce.date().optional(),
            heroImage: z.optional(image()),
			tags: z.array(z.string()).default([]),
        }),
});

const friend = defineCollection({
    // 1. 修正 base 路徑指向 friend 資料夾
    loader: glob({ base: './src/content/friend', pattern: '**/*.{md,mdx}' }),
    // Type-check frontmatter using a schema
    schema: ({ image }) =>
        z.object({
            name: z.string(),
            order: z.number().optional(),
            heroImage: z.optional(image()),
            // 2. z.string 必須加上括號呼叫
            mediaLink: z.string(),
        }),
});

// 3. 同時匯出 blog 與 friend 集合
export const collections = { blog, friend };