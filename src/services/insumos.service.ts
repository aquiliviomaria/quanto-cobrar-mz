import { getDatabase } from '../database/db';
import { Insumo, InsumoInput } from '../types/insumo.types';

export async function getAllInsumos(utilizadorId: number): Promise<Insumo[]> {
  const db = await getDatabase();
  return db.getAllAsync<Insumo>(
    'SELECT * FROM insumos WHERE utilizador_id = ? ORDER BY nome ASC',
    [utilizadorId]
  );
}

export async function createInsumo(input: InsumoInput, utilizadorId: number): Promise<number> {
  const db = await getDatabase();
  const custo_unitario = input.preco_total / input.quantidade_comprada;
  const result = await db.runAsync(
    `INSERT INTO insumos (utilizador_id, nome, categoria, quantidade_comprada, unidade, preco_total, custo_unitario, tipo_ingrediente)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [utilizadorId, input.nome, input.categoria, input.quantidade_comprada, input.unidade,
     input.preco_total, custo_unitario, (input as any).tipo_ingrediente ?? null]
  );
  return result.lastInsertRowId;
}

export async function updateInsumo(id: number, input: InsumoInput, utilizadorId: number): Promise<void> {
  const db = await getDatabase();
  const custo_unitario = input.preco_total / input.quantidade_comprada;
  await db.runAsync(
    `UPDATE insumos SET nome=?, categoria=?, quantidade_comprada=?, unidade=?, preco_total=?,
     custo_unitario=?, tipo_ingrediente=?, updated_at=CURRENT_TIMESTAMP
     WHERE id=? AND utilizador_id=?`,
    [input.nome, input.categoria, input.quantidade_comprada, input.unidade,
     input.preco_total, custo_unitario, (input as any).tipo_ingrediente ?? null, id, utilizadorId]
  );
}

export async function deleteInsumo(id: number, utilizadorId: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM insumos WHERE id = ? AND utilizador_id = ?', [id, utilizadorId]);
}
