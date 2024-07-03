import { Kysely, SqliteDialect, sql } from 'kysely';

export async function up(db: Kysely<SqliteDialect>) {
  await db.schema
    .createTable('users')
    .ifNotExists()
    .addColumn('id', 'integer', (col) =>
      col.primaryKey().autoIncrement().notNull()
    )
    .addColumn('user_name', 'text', (col) => col.notNull().unique())
    .execute();

  await db.schema
    .createTable('sprints')
    .ifNotExists()
    .addColumn('id', 'integer', (col) =>
      col.primaryKey().autoIncrement().notNull()
    )
    .addColumn('sprint_code', 'text', (col) => col.notNull().unique())
    .addColumn('sprint_name', 'text', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('templates')
    .ifNotExists()
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('message_template', 'text', (col) => col.notNull()) // Updated column name
    .execute();

  await db.schema
    .createTable('messages')
    .ifNotExists()
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('user_id', 'integer', (col) =>
      col.references('users.id').onDelete('cascade').notNull()
    )
    .addColumn('template_id', 'integer', (col) =>
      col.references('templates.id').onDelete('cascade').notNull()
    )
    .addColumn('sprint_id', 'integer', (col) =>
      col.references('sprints.id').onDelete('cascade').notNull()
    )
    .addColumn('timestamp', 'datetime', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .execute();
}

export async function down(db: Kysely<SqliteDialect>) {
  await db.schema.dropTable('messages').ifExists().execute();
  await db.schema.dropTable('templates').ifExists().execute();
  await db.schema.dropTable('sprints').ifExists().execute();
  await db.schema.dropTable('users').ifExists().execute();
}
