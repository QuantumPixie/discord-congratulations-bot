import { migrateDefault } from '../../src/database/migrate/bin';
import { migrateToLatest } from '../../src/database/migrate/migrateToLatest';
import { db } from '../../src/database';

jest.mock('../../src/database');
jest.mock('../../src/database/migrate/migrateToLatest');

describe('Database Migration Tests', () => {
  const dbUrl = 'test-database-url';

  it('should run migrations successfully', async () => {
    (migrateToLatest as jest.Mock).mockResolvedValue({
      results: [{ status: 'Success', migrationName: 'test_migration' }],
      error: null,
    });

    await migrateDefault(dbUrl);

    expect(migrateToLatest).toHaveBeenCalledWith(db, expect.any(Object));
  });

  it('should handle migration errors', async () => {
    const error = new Error('Migration error');
    (migrateToLatest as jest.Mock).mockResolvedValue({
      results: [],
      error,
    });

    await expect(migrateDefault(dbUrl)).rejects.toThrow('Migration failed');
    expect(migrateToLatest).toHaveBeenCalledWith(db, expect.any(Object));
  });
});
