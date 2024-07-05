import 'dotenv/config';
import { CamelCasePlugin, Kysely, SqliteDialect } from 'kysely';
import SQlite from 'better-sqlite3';
import { type DB } from '../types';

export function createDatabase(url: string): Kysely<DB> {
  return new Kysely<DB>({
    dialect: new SqliteDialect({
      database: new SQlite(url),
    }),
    plugins: [new CamelCasePlugin()],
  });
}

const db = createDatabase(process.env.DATABASE_URL || './data/database.db');

export { db };
export type Database = Kysely<DB>;
export type DatabasePartial<T> = Kysely<T>;
export * from '../types';
