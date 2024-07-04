import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

describe('Database Initialization Tests', () => {
  const migrationsDir = path.resolve(
    __dirname,
    '../../src/database/migrations'
  );

  beforeAll(() => {
    if (!fs.existsSync(migrationsDir)) {
      fs.mkdirSync(migrationsDir, { recursive: true });
    }
  });

  afterAll(() => {
    fs.rmSync(migrationsDir, { recursive: true, force: true });
  });

  it('should create a new migration file', () => {
    const description = 'test_migration';
    execSync(`npm run create-migration ${description}`);

    const files = fs.readdirSync(migrationsDir);
    const migrationFile = files.find((file) => file.includes(description));

    expect(migrationFile).toBeDefined();
    const filePath = path.join(migrationsDir, migrationFile!);
    const content = fs.readFileSync(filePath, 'utf8');
    expect(content).toContain(
      'export async function up(db: Kysely<SqliteDialect>)'
    );
    expect(content).toContain(
      'export async function down(db: Kysely<SqliteDialect>)'
    );
  });
});
