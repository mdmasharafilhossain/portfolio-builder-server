
import { z } from 'zod';

export const createBlogSchema = z.object({
 body: z.object({
    title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
    content: z.string().min(1, 'Content is required'),
    excerpt: z.string().min(1, 'Excerpt is required').max(500, 'Excerpt too long'),
    slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
    imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
    tags: z.array(z.string()).default([]),
    published: z.boolean().default(true)
  })
});

export const updateBlogSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'ID is required')
  }),
  body: z.object({
    title: z.string().min(1).max(255).optional(),
    content: z.string().min(1).optional(),
    excerpt: z.string().min(1).max(500).optional(),
    slug: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
    imageUrl: z.string().url().optional().or(z.literal('')),
    tags: z.array(z.string()).optional(),
    published: z.boolean().optional()
  })
});

export const blogParamsSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'ID is required')
  })
});

export const blogSlugSchema = z.object({
  params: z.object({
    slug: z.string().min(1, 'Slug is required')
  })
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>['body'];
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>['body'];
export type BlogParams = z.infer<typeof blogParamsSchema>['params'];
export type BlogSlugParams = z.infer<typeof blogSlugSchema>['params'];