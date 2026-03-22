import { getDatabase } from '../database/db';
import { Produto, ProdutoInput, ProdutoInsumo } from '../types/produto.types';

export async function getAllProdutos(): Promise<Produto[]> {
  const db = await getDatabase();
  return db.getAllAsync<Produto>('SELECT * FROM produtos ORDER BY nome ASC');
}

export async function getProdutoById(id: number): Promise<Produto | null> {
  const db = await getDatabase();
  const produto = await db.getFirstAsync<Produto>('SELECT * FROM produtos WHERE id = ?', [id]);
  if (!produto) return null;
  produto.insumos = await getProdutoInsumos(id);
  return produto;
}

export async function getProdutoInsumos(produto_id: number): Promise<ProdutoInsumo[]> {
  const db = await getDatabase();
  return db.getAllAsync<ProdutoInsumo>(
    `SELECT pi.*, i.nome as insumo_nome, i.unidade as insumo_unidade, i.custo_unitario
     FROM produto_insumos pi
     JOIN insumos i ON i.id = pi.insumo_id
     WHERE pi.produto_id = ?`,
    [produto_id]
  );
}

export async function createProduto(input: ProdutoInput): Promise<number> {
  const db = await getDatabase();
  const result = await db.runAsync(
    `INSERT INTO produtos (nome, categoria, descricao, rendimento, unidade_rendimento, custo_extra, margem_padrao)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [input.nome, input.categoria, input.descricao ?? null, input.rendimento,
     input.unidade_rendimento, input.custo_extra, input.margem_padrao]
  );
  const produtoId = result.lastInsertRowId;
  if (input.insumos && input.insumos.length > 0) {
    await saveProdutoInsumos(produtoId, input.insumos);
  }
  return produtoId;
}

export async function updateProduto(id: number, input: ProdutoInput): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `UPDATE produtos SET nome=?, categoria=?, descricao=?, rendimento=?, unidade_rendimento=?,
     custo_extra=?, margem_padrao=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
    [input.nome, input.categoria, input.descricao ?? null, input.rendimento,
     input.unidade_rendimento, input.custo_extra, input.margem_padrao, id]
  );
  await db.runAsync('DELETE FROM produto_insumos WHERE produto_id = ?', [id]);
  if (input.insumos && input.insumos.length > 0) {
    await saveProdutoInsumos(id, input.insumos);
  }
}

async function saveProdutoInsumos(produto_id: number, insumos: ProdutoInsumo[]): Promise<void> {
  const db = await getDatabase();
  for (const pi of insumos) {
    await db.runAsync(
      'INSERT INTO produto_insumos (produto_id, insumo_id, quantidade_usada) VALUES (?, ?, ?)',
      [produto_id, pi.insumo_id, pi.quantidade_usada]
    );
  }
}

export async function deleteProduto(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM produtos WHERE id = ?', [id]);
}
