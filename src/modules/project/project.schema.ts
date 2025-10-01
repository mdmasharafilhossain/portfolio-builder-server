
import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(78, 'Title too long'),
    description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
    longDescription: z.string().min(1, 'Long description is required'),
    technologies: z.array(z.string()).min(1, 'At least one technology is required'),
    projectUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
    githubUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
    liveUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
    featured: z.boolean().default(false),
    imageUrl: z.string().url('Invalid URL').optional().or(z.literal(''))
  })
});

export const updateProjectSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'ID is required')
  }),
  body: z.object({
    title: z.string().min(1).max(255).optional(),
    description: z.string().min(1).max(500).optional(),
    longDescription: z.string().min(1).optional(),
    technologies: z.array(z.string()).min(1).optional(),
    projectUrl: z.string().url().optional().or(z.literal('')),
    githubUrl: z.string().url().optional().or(z.literal('')),
    liveUrl: z.string().url().optional().or(z.literal('')),
    featured: z.boolean().optional(),
    imageUrl: z.string().url().optional().or(z.literal(''))
  })
});

export const projectParamsSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'ID is required')
  })
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>['body'];
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>['body'];
export type ProjectParams = z.infer<typeof projectParamsSchema>['params'];