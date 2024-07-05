import { z } from 'zod';

export const createSprintSchema = z.object({
  sprintCode: z.string().min(1),
  sprintName: z.string().min(1),
});

export const updateSprintSchema = z.object({
  id: z.number(),
  sprintCode: z.string().min(1),
  sprintName: z.string().min(1),
});
