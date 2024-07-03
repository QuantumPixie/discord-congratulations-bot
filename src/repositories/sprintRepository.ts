import { db } from '../database';
import { Sprints as Sprint } from '../database/types';
import { mapSprint } from '../utils/mapTypes/mapSprint';

export type PartialSprint = Partial<Omit<Sprint, 'id'>> & { id?: number };

export const sprintRepository = {
  async findAll(): Promise<Sprint[]> {
    const sprints = await db.selectFrom('sprints').selectAll().execute();
    return sprints.map(mapSprint);
  },

  async findById(id: number): Promise<Sprint | undefined> {
    const sprints = await db
      .selectFrom('sprints')
      .selectAll()
      .where('id', '=', id)
      .execute();
    return sprints.length ? mapSprint(sprints[0]) : undefined;
  },

  async findBySprintCode(sprintCode: string): Promise<Sprint | undefined> {
    const sprints = await db
      .selectFrom('sprints')
      .selectAll()
      .where('sprint_code', '=', sprintCode)
      .execute();
    return sprints.length ? mapSprint(sprints[0]) : undefined;
  },

  async create(sprint: Omit<Sprint, 'id'>): Promise<void> {
    await db.insertInto('sprints').values(sprint).execute();
  },

  async update(id: number, sprint: PartialSprint): Promise<boolean> {
    const result = await db
      .updateTable('sprints')
      .set(sprint)
      .where('id', '=', id)
      .execute();
    return result.length > 0;
  },

  async delete(id: number): Promise<boolean> {
    const result = await db
      .deleteFrom('sprints')
      .where('id', '=', id)
      .execute();
    return result.length > 0;
  },
};
