import 'dotenv/config';
import { CamelCasePlugin, Kysely, SqliteDialect } from 'kysely';
import SQlite from 'better-sqlite3';
import { DB } from './types';
import fs from 'fs';
import path from 'path';

export function createDatabase(url: string): Kysely<DB> {
  // Ensure the directory exists
  const dir = path.dirname(url);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  return new Kysely<DB>({
    dialect: new SqliteDialect({
      database: new SQlite(url),
    }),
    plugins: [new CamelCasePlugin()],
  });
}

const dbUrl = process.env.DATABASE_URL || './data/database.db';
const db = createDatabase(dbUrl);

console.log(`Database path: ${dbUrl}`);

export { db };
export type Database = Kysely<DB>;
export type DatabasePartial<T> = Kysely<T>;
export * from './types';
