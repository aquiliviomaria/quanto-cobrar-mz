import { getDatabase } from '../database/db';
import { Orcamento, OrcamentoInput } from '../types/orcamento.types';

export async function getAllOrcamentos(utilizadorId: number): Promise<Orcamento[]> {
  const db = await getDatabase();
  return db.getAllAsync<Orcamento>(
    `SELECT o.*, p.nome as produto_nome
     FROM orcamentos o
     JOIN produtos p ON p.id = o.produto_id
     WHERE o.utilizador_id = ?
     ORDER BY o.created_at DESC`,
    [utilizadorId]
  );
}

export async function createOrcamento(input: OrcamentoInput, utilizadorId: number): Promise<number> {
  const db = await getDatabase();
  const result = await db.runAsync(
    `INSERT INTO orcamentos (utilizador_id, cliente_nome, produto_id, quantidade, margem_aplicada,
     custo_total, valor_lucro, preco_sugerido, preco_arredondado, status, observacoes, descricao_pedido)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [utilizadorId, input.cliente_nome ?? null, input.produto_id, input.quantidade,
     input.margem_aplicada, input.custo_total, input.valor_lucro, input.preco_sugerido,
     input.preco_arredondado, input.status, input.observacoes ?? null,
     (input as any).descricao_pedido ?? null]
  );
  return result.lastInsertRowId;
}

export async function updateOrcamentoStatus(id: number, status: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('UPDATE orcamentos SET status = ? WHERE id = ?', [status, id]);
}

export async function deleteOrcamento(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM orcamentos WHERE id = ?', [id]);
}
