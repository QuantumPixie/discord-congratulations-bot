import { z } from 'zod';
import type { Users } from '../database/types';

// validation schema
const schema = z.object({
  id: z.number().min(1),
  username: z.string().min(1),
});

// schema version for inserting new records
const insertable = schema.omit({
  id: true,
});

// schema version for updating existing records
const updateable = schema.partial();

export const parse = (record: unknown) => schema.parse(record);
export const parseId = (id: unknown) => schema.shape.id.parse(id);
export const parseInsertable = (record: unknown) => insertable.parse(record);
export const parseUpdatable = (record: unknown) => updateable.parse(record);

// matches database and validation schema keys
export const keys: (keyof Users)[] = ['id', 'user_name'];
