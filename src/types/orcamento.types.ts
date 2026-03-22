export type StatusOrcamento = 'pendente' | 'aceite' | 'recusado' | 'concluído';

export interface Orcamento {
  id: number;
  cliente_nome?: string;
  produto_id: number;
  produto_nome?: string;
  quantidade: number;
  margem_aplicada: number;
  custo_total: number;
  valor_lucro: number;
  preco_sugerido: number;
  preco_arredondado: number;
  status: StatusOrcamento;
  observacoes?: string;
  created_at: string;
}

export type OrcamentoInput = Omit<Orcamento, 'id' | 'created_at' | 'produto_nome'>;

export interface ResultadoCalculo {
  custo_total: number;
  valor_lucro: number;
  preco_sugerido: number;
  preco_arredondado: number;
}
