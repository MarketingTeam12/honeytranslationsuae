import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import {
  DB_CLIENT,
  DB_PATH,
  MYSQL_DATABASE,
  MYSQL_HOST,
  MYSQL_PASSWORD,
  MYSQL_PORT,
  MYSQL_USER,
} from '../config.js';

const isMySql = DB_CLIENT === 'mysql';

let sqliteDb = null;
let mysqlPool = null;

if (!isMySql) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  sqliteDb = new Database(DB_PATH);
  sqliteDb.pragma('foreign_keys = ON');
}

async function getMySqlPool() {
  if (!isMySql) return null;
  if (mysqlPool) return mysqlPool;

  let mysqlModule;
  try {
    mysqlModule = await import('mysql2/promise');
  } catch {
    throw new Error('MySQL mode requires `mysql2`. Install it with `npm install mysql2`.');
  }

  const { createPool } = mysqlModule;
  mysqlPool = createPool({
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: 'Z',
  });

  return mysqlPool;
}

async function mysqlQuery(sql, params = [], connection = null) {
  const pool = await getMySqlPool();
  const executor = connection || pool;
  const [rows] = await executor.query(sql, params);
  return rows;
}

export async function dbAll(sql, params = [], connection = null) {
  if (isMySql) {
    return mysqlQuery(sql, params, connection);
  }

  return sqliteDb.prepare(sql).all(...params);
}

export async function dbGet(sql, params = [], connection = null) {
  if (isMySql) {
    const rows = await mysqlQuery(sql, params, connection);
    return rows[0] || null;
  }

  return sqliteDb.prepare(sql).get(...params) || null;
}

export async function dbRun(sql, params = [], connection = null) {
  if (isMySql) {
    const result = await mysqlQuery(sql, params, connection);
    return {
      changes: Number(result?.affectedRows || 0),
      lastInsertRowid: Number(result?.insertId || 0),
    };
  }

  const result = sqliteDb.prepare(sql).run(...params);
  return {
    changes: Number(result?.changes || 0),
    lastInsertRowid: Number(result?.lastInsertRowid || 0),
  };
}

export async function dbExec(sql, connection = null) {
  if (isMySql) {
    await mysqlQuery(sql, [], connection);
    return;
  }

  sqliteDb.exec(sql);
}

export async function withTransaction(handler) {
  if (isMySql) {
    const pool = await getMySqlPool();
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();
      const result = await handler({
        all: (sql, params = []) => dbAll(sql, params, connection),
        get: (sql, params = []) => dbGet(sql, params, connection),
        run: (sql, params = []) => dbRun(sql, params, connection),
        exec: (sql) => dbExec(sql, connection),
      });
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  await dbExec('BEGIN');
  try {
    const result = await handler({
      all: (sql, params = []) => dbAll(sql, params),
      get: (sql, params = []) => dbGet(sql, params),
      run: (sql, params = []) => dbRun(sql, params),
      exec: (sql) => dbExec(sql),
    });
    await dbExec('COMMIT');
    return result;
  } catch (error) {
    await dbExec('ROLLBACK');
    throw error;
  }
}

export async function closeDb() {
  if (isMySql && mysqlPool) {
    await mysqlPool.end();
    mysqlPool = null;
  }

  if (!isMySql && sqliteDb) {
    sqliteDb.close();
    sqliteDb = null;
  }
}

export { isMySql };
