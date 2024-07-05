import { z } from 'zod';
import type { Messages } from '../database/types';

// validation schema
const schema = z.object({
  id: z.number().min(1),
  user_id: z.number().min(1),
  template_id: z.number().min(1),
  sprint_id: z.number().min(1),
  timestamp: z.string(),
});

// schema version for inserting new records
const insertable = schema.omit({
  id: true,
  timestamp: true,
});

// schema version for updating existing records
const updateable = insertable
  .omit({
    user_id: true,
    sprint_id: true,
    template_id: true,
  })
  .partial();

export const parse = (record: unknown) => schema.parse(record);
export const parseId = (id: unknown) => schema.shape.id.parse(id);
export const parseInsertable = (record: unknown) => insertable.parse(record);
export const parseUpdatable = (record: unknown) => updateable.parse(record);

// matches database and validation schema keys
export const keys: (keyof Messages)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[];
