
import { About } from '@prisma/client';
import { z } from 'zod';


export const socialLinkSchema = z.object({
  platform: z.string().min(1, 'Platform is required'),
  url: z.string().url('Invalid URL'),
  icon: z.string().min(1, 'Icon is required')
});


export const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  level: z.number().min(0).max(100, 'Level must be between 0 and 100'),
  category: z.string().min(1, 'Category is required')
});


export const experienceSchema = z.object({
  id: z.string().optional(),
  company: z.string().min(1, 'Company is required'),
  position: z.string().min(1, 'Position is required'),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional().nullable(),
  current: z.boolean().default(false),
  description: z.string().min(1, 'Description is required'),
  technologies: z.array(z.string()).default([])
});


export const createAboutSchema = z.object({
  
    name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    bio: z.string().min(1, 'Bio is required').max(2000, 'Bio too long'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
    avatarUrl: z.string().url('Invalid URL').optional().nullable().or(z.literal('')),
    resumeUrl: z.string().url('Invalid URL').optional().nullable().or(z.literal('')),
    socialLinks: z.array(socialLinkSchema).default([]),
    skills: z.array(skillSchema).default([]),
    experiences: z.array(experienceSchema).default([])
 
});

export const updateAboutSchema = z.object({

    name: z.string().min(1).max(100).optional(),
    title: z.string().min(1).max(200).optional(),
    bio: z.string().min(1).max(2000).optional(),
    email: z.string().email().optional(),
    phone: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
    avatarUrl: z.string().url().optional().nullable().or(z.literal('')),
    resumeUrl: z.string().url().optional().nullable().or(z.literal('')),
    socialLinks: z.array(socialLinkSchema).optional(),
    skills: z.array(skillSchema).optional(),
    experiences: z.array(experienceSchema).optional()

});

export const aboutParamsSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'ID is required')
  })
});

export interface AboutWithRelations extends About {
  
  socialLinks: any[];
  skills: any[];
  experiences: any[];
}
export type CreateAboutInput = z.infer<typeof createAboutSchema>;
export type UpdateAboutInput = z.infer<typeof updateAboutSchema>;
export type AboutParams = z.infer<typeof aboutParamsSchema>['params'];
export type SocialLink = z.infer<typeof socialLinkSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type Experience = z.infer<typeof experienceSchema>;