import * as SQLite from 'expo-sqlite';
import { CREATE_TABLES } from './schema';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync('quantocobrar.db');
    await db.execAsync('PRAGMA foreign_keys = ON;');
    // Criar tabelas separadamente
    const tables = CREATE_TABLES.split(';').map(s => s.trim()).filter(Boolean);
    for (const sql of tables) {
      await db.execAsync(sql + ';');
    }
    // Inserir configuração padrão se não existir
    await db.execAsync(`
      INSERT OR IGNORE INTO configuracoes (id, moeda, margem_padrao, arredondamento_ativo, tipo_arredondamento)
      VALUES (1, 'MT', 30, 1, 'dezena');
    `);
  }
  return db;
}
