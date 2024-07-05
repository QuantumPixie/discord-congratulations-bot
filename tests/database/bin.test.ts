import { Kysely, Dialect, SqliteDialect } from 'kysely';
import { migrateToLatest } from '../../src/database/migrate/migrateToLatest';
import { migrateDefault } from '../../src/database/migrate/bin';
import { describe, it, expect, vi } from 'vitest';

class MockDialect implements Dialect {
  createDriver() {
    return {} as any;
  }
  createQueryCompiler() {
    return {} as any;
  }
  createAdapter() {
    return {} as any;
  }
  createIntrospector() {
    return {} as any;
  }
}

vi.mock('../../src/database/migrate/migrateToLatest');

describe('Database Migration Tests', () => {
  const dbUrl = 'test-database-url';
  const db = new Kysely<any>({
    dialect: new MockDialect(),
  });

  it('should run migrations successfully', async () => {
    vi.mocked(migrateToLatest).mockResolvedValue({
      results: [
        {
          status: 'Success',
          migrationName: 'test_migration',
          direction: 'Up',
        },
      ],
      error: null,
    });

    await migrateDefault(dbUrl);

    expect(migrateToLatest).toHaveBeenCalledWith(db, expect.any(Object));
  });

  it('should handle migration errors', async () => {
    const error = new Error('Migration error');
    vi.mocked(migrateToLatest).mockResolvedValue({
      results: [],
      error,
    });

    await expect(migrateDefault(dbUrl)).rejects.toThrow(
      'process.exit unexpectedly called with "1"'
    );
    expect(migrateToLatest).toHaveBeenCalledWith(db, expect.any(Object));
  });
});
