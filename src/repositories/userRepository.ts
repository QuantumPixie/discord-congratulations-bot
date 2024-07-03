import { db } from '../database';
import { Users as User, UsersUpdate } from '../database/types';
import { mapUser } from '../utils/mapTypes/mapUser';

export const userRepository = {
  async findAll(): Promise<User[]> {
    const users = await db.selectFrom('users').selectAll().execute();
    return users.map(mapUser);
  },

  async findByUserName(userName: string): Promise<User | undefined> {
    const users = await db
      .selectFrom('users')
      .selectAll()
      .where('user_name', '=', userName)
      .execute();
    return users.length ? mapUser(users[0]) : undefined;
  },

  async findById(id: number): Promise<User | undefined> {
    const users = await db
      .selectFrom('users')
      .selectAll()
      .where('id', '=', id)
      .execute();
    return users.length ? mapUser(users[0]) : undefined;
  },

  async create(user: Omit<User, 'id'>): Promise<User> {
    const [createdUser] = await db
      .insertInto('users')
      .values(user)
      .returning(['id', 'user_name'])
      .execute();
    return mapUser(createdUser);
  },

  async update(id: number, user: Partial<UsersUpdate>): Promise<boolean> {
    const result = await db
      .updateTable('users')
      .set(user)
      .where('id', '=', id)
      .execute();
    return result.length > 0;
  },

  async delete(id: number): Promise<boolean> {
    const result = await db.deleteFrom('users').where('id', '=', id).execute();
    return result.length > 0;
  },
};
