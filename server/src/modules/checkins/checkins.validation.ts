import { z } from 'zod';

export const checkInSchema = z.object({
  params: z.object({
    habitId: z.string().min(1),
  }),
  body: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in YYYY-MM-DD format' }).optional(),
  }).optional(),
});
