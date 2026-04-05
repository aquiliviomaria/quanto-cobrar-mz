export type UnidadeInsumo =
  | 'kg' | 'g' | 'L' | 'ml'
  | 'unidade' | 'dúzia' | 'caixa' | 'pacote' | 'saco';

export type CategoriaInsumo =
  | 'Ingrediente' | 'Embalagem' | 'Decoração'
  | 'Transporte' | 'Mão de obra' | 'Outro';

export interface Insumo {
  id: number;
  nome: string;
  categoria: CategoriaInsumo;
  quantidade_comprada: number;
  unidade: UnidadeInsumo;
  preco_total: number;
  custo_unitario: number;
  tipo_ingrediente?: string;
  created_at: string;
  updated_at: string;
}

export type InsumoInput = Omit<Insumo, 'id' | 'custo_unitario' | 'created_at' | 'updated_at'>;
