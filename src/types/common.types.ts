export interface Configuracoes {
  id: number;
  moeda: string;
  margem_padrao: number;
  arredondamento_ativo: boolean;
  tipo_arredondamento: 'dezena' | 'cinquenta' | 'centena';
}
