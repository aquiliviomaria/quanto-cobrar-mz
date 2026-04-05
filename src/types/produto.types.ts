export type CategoriaProduto =
  | 'Bolo' | 'Cupcake' | 'Doce' | 'Salgado'
  | 'Serviço' | 'Outro';

export interface ProdutoInsumo {
  id?: number;
  produto_id: number;
  insumo_id: number;
  quantidade_usada: number;
  custo_calculado?: number;
  unidade_usada?: string;
  // campos extras para exibição
  insumo_nome?: string;
  insumo_unidade?: string;
  custo_unitario?: number;
}

export interface Produto {
  id: number;
  nome: string;
  categoria: CategoriaProduto;
  descricao?: string;
  rendimento: number;
  unidade_rendimento: string;
  custo_extra: number;
  margem_padrao: number;
  created_at: string;
  updated_at: string;
  insumos?: ProdutoInsumo[];
}

export type ProdutoInput = Omit<Produto, 'id' | 'created_at' | 'updated_at'>;
