import { z } from 'zod';

export const createUserSchema = z.object({
  username: z.string().min(1),
});

export const updateUserSchema = z.object({
  id: z.number(),
  username: z.string().min(1),
});
