import { z } from 'zod';

export const sprintSchema = z.object({
  sprint_code: z.string(),
  sprint_name: z.string(),
});

export const parseInsertable = (data: unknown) => sprintSchema.parse(data);

export const parseUpdatable = (data: unknown) =>
  sprintSchema.partial().parse(data);
