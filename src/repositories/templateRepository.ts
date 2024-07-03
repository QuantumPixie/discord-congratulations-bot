import { db } from '../database';
import { Templates as Template, TemplatesUpdate } from '../database/types';
import { mapTemplate } from '../utils/mapTypes/mapTemplate';
import { sql } from 'kysely';

export const templateRepository = {
  async findAll(): Promise<Template[]> {
    const templates = await db.selectFrom('templates').selectAll().execute();
    return templates.map(mapTemplate);
  },

  async findRandom(): Promise<Template | undefined> {
    const templates = await db
      .selectFrom('templates')
      .selectAll()
      .orderBy(sql`RANDOM()`)
      .limit(1)
      .execute();
    return templates.length ? mapTemplate(templates[0]) : undefined;
  },

  async findById(id: number): Promise<Template | undefined> {
    const templates = await db
      .selectFrom('templates')
      .selectAll()
      .where('id', '=', id)
      .execute();
    return templates.length ? mapTemplate(templates[0]) : undefined;
  },

  async create(template: Omit<Template, 'id'>): Promise<void> {
    await db.insertInto('templates').values(template).execute();
  },

  async update(
    id: number,
    template: Partial<TemplatesUpdate>
  ): Promise<boolean> {
    const result = await db
      .updateTable('templates')
      .set(template)
      .where('id', '=', id)
      .execute();
    return result.length > 0;
  },

  async delete(id: number): Promise<boolean> {
    const result = await db
      .deleteFrom('templates')
      .where('id', '=', id)
      .execute();
    return result.length > 0;
  },
};
