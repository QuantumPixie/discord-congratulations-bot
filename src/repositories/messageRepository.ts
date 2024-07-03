import { db } from '../database';
import { Messages as Message, MessagesUpdate } from '../database/types';
import { mapMessage } from '../utils/mapTypes/mapMessage';

export const messageRepository = {
  async findAll(): Promise<Message[]> {
    const messages = await db.selectFrom('messages').selectAll().execute();
    return messages.map(mapMessage);
  },

  async findByUserId(userId: number): Promise<Message[]> {
    const messages = await db
      .selectFrom('messages')
      .selectAll()
      .where('user_id', '=', userId)
      .execute();
    return messages.map(mapMessage);
  },

  async findBySprintId(sprintId: number): Promise<Message[]> {
    const messages = await db
      .selectFrom('messages')
      .selectAll()
      .where('sprint_id', '=', sprintId)
      .execute();
    return messages.map(mapMessage);
  },

  async create(message: Omit<Message, 'id' | 'timestamp'>): Promise<void> {
    await db
      .insertInto('messages')
      .values({
        ...message,
        timestamp: new Date().toISOString(),
      })
      .execute();
  },

  async update(id: number, message: Partial<MessagesUpdate>): Promise<boolean> {
    const result = await db
      .updateTable('messages')
      .set(message)
      .where('id', '=', id)
      .execute();
    return result.length > 0;
  },

  async delete(id: number): Promise<boolean> {
    const result = await db
      .deleteFrom('messages')
      .where('id', '=', id)
      .execute();
    return result.length > 0;
  },
};
