import * as SQLite from 'expo-sqlite';
import { CREATE_TABLES } from './schema';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync('quantocobrar.db');
    await db.execAsync('PRAGMA foreign_keys = ON;');
    const tables = CREATE_TABLES.split(';').map(s => s.trim()).filter(Boolean);
    for (const sql of tables) {
      await db.execAsync(sql + ';');
    }
    await db.execAsync(`
      INSERT OR IGNORE INTO configuracoes (id, moeda, margem_padrao, arredondamento_ativo, tipo_arredondamento)
      VALUES (1, 'MT', 30, 1, 'dezena');
    `);
    // Migrações — adicionar colunas se não existirem
    try { await db.execAsync('ALTER TABLE utilizadores ADD COLUMN telefone TEXT;'); } catch {}
    try { await db.execAsync('ALTER TABLE utilizadores ADD COLUMN empresa TEXT;'); } catch {}
    try { await db.execAsync('ALTER TABLE orcamentos ADD COLUMN descricao_pedido TEXT;'); } catch {}
    try { await db.execAsync('ALTER TABLE insumos ADD COLUMN tipo_ingrediente TEXT;'); } catch {}
    try { await db.execAsync('ALTER TABLE produto_insumos ADD COLUMN custo_calculado REAL NOT NULL DEFAULT 0;'); } catch {}
    try { await db.execAsync('ALTER TABLE produto_insumos ADD COLUMN unidade_usada TEXT;'); } catch {}
    try { await db.execAsync('ALTER TABLE insumos ADD COLUMN utilizador_id INTEGER NOT NULL DEFAULT 1;'); } catch {}
    try { await db.execAsync('ALTER TABLE produtos ADD COLUMN utilizador_id INTEGER NOT NULL DEFAULT 1;'); } catch {}
    try { await db.execAsync('ALTER TABLE orcamentos ADD COLUMN utilizador_id INTEGER NOT NULL DEFAULT 1;'); } catch {}
    // Migração: actualizar custo_calculado para registos antigos (custo_calculado = 0)
    // Usa custo_unitario do insumo × quantidade_usada como estimativa
    try {
      await db.execAsync(`
        UPDATE produto_insumos
        SET custo_calculado = (
          SELECT pi.quantidade_usada * i.custo_unitario
          FROM produto_insumos pi
          JOIN insumos i ON i.id = pi.insumo_id
          WHERE pi.id = produto_insumos.id
        )
        WHERE custo_calculado = 0 OR custo_calculado IS NULL;
      `);
    } catch {}
  }
  return db;
}

export function initDatabase(): Promise<void> {
  return getDatabase().then(() => undefined);
}
