import { z } from 'zod';

export const createMessageSchema = z.object({
  username: z.string().min(1),
  sprintCode: z.string().min(1),
});
