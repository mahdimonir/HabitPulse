import { z } from 'zod';

export const createHabitSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, { message: 'Title is required' }),
    description: z.string().optional(),
    category: z.string().optional(),
  }),
});

export const updateHabitSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    title: z.string().trim().min(1).optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    archived: z.boolean().optional(),
  }),
});
