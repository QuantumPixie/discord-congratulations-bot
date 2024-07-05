import { Kysely, MigrationProvider, Migrator } from 'kysely';

export async function migrateToLatest(
  db: Kysely<any>,
  provider: MigrationProvider
) {
  const migrator = new Migrator({
    db,
    provider,
  });

  const migrationResult = await migrator.migrateToLatest();

  console.log('Migration Result:', migrationResult);
  return migrationResult;
}
