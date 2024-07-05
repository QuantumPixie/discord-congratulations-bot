import { z } from 'zod';

export const createTemplateSchema = z.object({
  messageTemplate: z.string().min(1),
});

export const updateTemplateSchema = z.object({
  id: z.number(),
  messageTemplate: z.string().min(1),
});
