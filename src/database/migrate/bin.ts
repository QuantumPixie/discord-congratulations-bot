import 'dotenv/config';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import SQLite from 'better-sqlite3';
import { FileMigrationProvider, Kysely, SqliteDialect } from 'kysely';
import { migrateToLatest } from '../migrate/migrateToLatest';
import { DB } from '../types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIGRATIONS_PATH = path.resolve(__dirname, '../migrations');

export async function migrateDefault(url: string) {
  console.log('Starting migration process...');
  console.log(`Using database at: ${url}`);

  const db = new Kysely<DB>({
    dialect: new SqliteDialect({
      database: new SQLite(url),
    }),
  });

  const fileMigrationProvider = new FileMigrationProvider({
    fs,
    path,
    migrationFolder: MIGRATIONS_PATH,
  });

  try {
    const { results, error } =
      (await migrateToLatest(db, fileMigrationProvider)) || {};

    results?.forEach((it: { status: string; migrationName: unknown }) => {
      if (it.status === 'Success') {
        console.log(
          `Migration "${it.migrationName}" was executed successfully`
        );
      } else if (it.status === 'Error') {
        console.error(`Failed to execute migration "${it.migrationName}"`);
      }
    });

    if (error) {
      console.error('Migration failed');
      console.error(error);
      process.exit(1);
    }

    console.log('All migrations executed successfully');
  } catch (err) {
    console.error('An error occurred during the migration process');
    console.error(err);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

if (import.meta.url === `file://${__filename}`) {
  const { DATABASE_URL } = process.env;

  if (typeof DATABASE_URL !== 'string') {
    console.error('Provide DATABASE_URL in your environment variables.');
    process.exit(1);
  }

  migrateDefault(DATABASE_URL).catch((err) => {
    console.error('Failed to run migrations');
    console.error(err);
    process.exit(1);
  });
}
