import { Kysely, Migrator, MigrationProvider } from 'kysely';
import { migrateToLatest } from '@src/database/migrate/migrateToLatest';

jest.mock('kysely');

describe('migrateToLatest', () => {
  it('should call migrator.migrateToLatest and log the result', async () => {
    const mockResult = {
      results: [{ status: 'Success', migrationName: 'test_migration' }],
      error: null,
    };
    (Migrator as jest.Mock).mockImplementation(() => ({
      migrateToLatest: jest.fn().mockResolvedValue(mockResult),
    }));

    const db = new Kysely<any>({ dialect: {} as any });
    const provider = {} as MigrationProvider;
    const result = await migrateToLatest(db, provider);

    expect(result).toEqual(mockResult);
  });
});
