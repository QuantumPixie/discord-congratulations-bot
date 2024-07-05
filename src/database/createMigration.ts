import { writeFile } from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createMigrationFile(description: string) {
  if (!description) {
    console.error('Usage: npm run create-migration <migration_description>');
    process.exit(1);
  }

  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '');
  const migrationFolderPath = path.resolve(__dirname, '../database/migrations');
  const migrationFileName = path.join(
    migrationFolderPath,
    `${timestamp}-${description}.ts`
  );

  const migrationContent = `
  import { Kysely, SqliteDialect } from 'kysely';

  export async function up(db: Kysely<SqliteDialect>) {
    // add migration logic here
  }

  export async function down(db: Kysely<SqliteDialect>) {
    // add migration logic here
  }
  `;

  try {
    await writeFile(migrationFileName, migrationContent.trim());
    console.log(`Migration file created: ${migrationFileName}`);
  } catch (err) {
    console.error(`Error: ${err}`);
  }
}

const [description] = process.argv.slice(2);
createMigrationFile(description);
