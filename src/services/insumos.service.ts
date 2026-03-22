import { getDatabase } from '../database/db';
import { Insumo, InsumoInput } from '../types/insumo.types';

export async function getAllInsumos(): Promise<Insumo[]> {
  const db = await getDatabase();
  return db.getAllAsync<Insumo>('SELECT * FROM insumos ORDER BY nome ASC');
}

export async function getInsumoById(id: number): Promise<Insumo | null> {
  const db = await getDatabase();
  return db.getFirstAsync<Insumo>('SELECT * FROM insumos WHERE id = ?', [id]);
}

export async function createInsumo(input: InsumoInput): Promise<number> {
  const db = await getDatabase();
  const custo_unitario = input.preco_total / input.quantidade_comprada;
  const result = await db.runAsync(
    `INSERT INTO insumos (nome, categoria, quantidade_comprada, unidade, preco_total, custo_unitario)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [input.nome, input.categoria, input.quantidade_comprada, input.unidade, input.preco_total, custo_unitario]
  );
  return result.lastInsertRowId;
}

export async function updateInsumo(id: number, input: InsumoInput): Promise<void> {
  const db = await getDatabase();
  const custo_unitario = input.preco_total / input.quantidade_comprada;
  await db.runAsync(
    `UPDATE insumos SET nome=?, categoria=?, quantidade_comprada=?, unidade=?, preco_total=?, custo_unitario=?, updated_at=CURRENT_TIMESTAMP
     WHERE id=?`,
    [input.nome, input.categoria, input.quantidade_comprada, input.unidade, input.preco_total, custo_unitario, id]
  );
}

export async function deleteInsumo(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM insumos WHERE id = ?', [id]);
}
