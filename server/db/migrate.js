import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DB_CLIENT } from '../config.js';
import { dbAll, dbExec } from './connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function splitSqlStatements(sql) {
  return sql
    .split(/;\s*\n/g)
    .map((statement) => statement.trim())
    .filter(Boolean);
}

export async function runMigrations() {
  const schemaFile = DB_CLIENT === 'mysql' ? 'schema.mysql.sql' : 'schema.sql';
  const schemaPath = path.join(__dirname, schemaFile);
  const schema = fs.readFileSync(schemaPath, 'utf8');

  if (DB_CLIENT === 'mysql') {
    const statements = splitSqlStatements(schema);
    for (const statement of statements) {
      await dbExec(statement);
    }
    // Keep author optional on existing MySQL databases too.
    try {
      await dbExec('ALTER TABLE blogs MODIFY author VARCHAR(160) DEFAULT NULL');
    } catch (error) {
      const message = error?.message || '';
      if (!/doesn['’]t exist|unknown table/i.test(message)) {
        throw error;
      }
    }
  } else {
    await dbExec(schema);
    // SQLite cannot easily relax NOT NULL in-place; normalize existing rows.
    const blogColumns = await dbAll('PRAGMA table_info(blogs)');
    if (Array.isArray(blogColumns) && blogColumns.some((column) => column?.name === 'author')) {
      await dbExec("UPDATE blogs SET author = 'Honey Translations Team' WHERE author IS NULL OR TRIM(author) = ''");
    }
  }

  console.log(`Database migration complete (${DB_CLIENT}).`);
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isDirectRun) {
  await runMigrations();
}
