export const CATEGORIAS_INSUMO = [
  'Ingrediente', 'Embalagem', 'Decoração', 'Transporte', 'Mão de obra', 'Outro',
] as const;

export const UNIDADES_INSUMO = [
  'kg', 'g', 'L', 'ml', 'unidade', 'dúzia', 'caixa', 'pacote', 'saco',
] as const;

export const CATEGORIAS_PRODUTO = [
  'Bolo', 'Cupcake', 'Doce', 'Salgado', 'Serviço', 'Outro',
] as const;

export const MARGENS_RAPIDAS = [20, 30, 40, 50];

export const STATUS_ORCAMENTO = ['pendente', 'aceite', 'recusado', 'concluído'] as const;

export const STATUS_COLORS: Record<string, string> = {
  pendente: '#F59E0B',
  aceite: '#22C55E',
  recusado: '#EF4444',
  concluído: '#6B7280',
};
