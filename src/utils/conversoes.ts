// Tipos de ingrediente disponíveis
export const TIPOS_INGREDIENTE = [
  { key: 'liquido',         label: 'Liquido (agua, leite, oleo...)' },
  { key: 'farinha_trigo',   label: 'Farinha de trigo' },
  { key: 'acucar_refinado', label: 'Acucar refinado' },
  { key: 'acucar_cristal',  label: 'Acucar cristal' },
  { key: 'acucar_mascavo',  label: 'Acucar mascavo' },
  { key: 'chocolate_po',    label: 'Chocolate em po / Cacau' },
  { key: 'canela_po',       label: 'Canela em po' },
  { key: 'mel',             label: 'Mel' },
  { key: 'queijo_ralado',   label: 'Queijo ralado' },
  { key: 'manteiga',        label: 'Manteiga / Margarina' },
  { key: 'fermento',        label: 'Fermento em po' },
  { key: 'ovo',             label: 'Ovo' },
  { key: 'outro',           label: 'Outro' },
] as const;

export type TipoIngredienteKey = typeof TIPOS_INGREDIENTE[number]['key'];

// Medidas caseiras usadas na receita
export const MEDIDAS_RECEITA = [
  { key: 'cup_1',    label: '1 chavena (1 cup)' },
  { key: 'cup_3_4',  label: '3/4 chavena' },
  { key: 'cup_2_3',  label: '2/3 chavena' },
  { key: 'cup_1_2',  label: '1/2 chavena' },
  { key: 'cup_1_3',  label: '1/3 chavena' },
  { key: 'cup_1_4',  label: '1/4 chavena' },
  { key: 'tbsp_1',   label: '1 colher de sopa' },
  { key: 'tbsp_1_2', label: '1/2 colher de sopa' },
  { key: 'tsp_1',    label: '1 colher de cha' },
  { key: 'tsp_1_2',  label: '1/2 colher de cha' },
  { key: 'tsp_1_4',  label: '1/4 colher de cha' },
  { key: 'ml',       label: 'Mililitro (ml)' },
  { key: 'l',        label: 'Litro (L)' },
  { key: 'g',        label: 'Grama (g)' },
  { key: 'kg',       label: 'Quilograma (kg)' },
  { key: 'unit',     label: 'Unidade' },
] as const;

// Medidas permitidas por tipo de ingrediente
export const MEDIDAS_POR_TIPO: Record<string, string[]> = {
  liquido:         ['cup_1','cup_3_4','cup_2_3','cup_1_2','cup_1_3','cup_1_4','tbsp_1','tbsp_1_2','tsp_1','tsp_1_2','tsp_1_4','ml','l'],
  farinha_trigo:   ['cup_1','cup_3_4','cup_2_3','cup_1_2','cup_1_3','cup_1_4','tbsp_1','tbsp_1_2','tsp_1','tsp_1_2','tsp_1_4','g','kg'],
  acucar_refinado: ['cup_1','cup_3_4','cup_2_3','cup_1_2','cup_1_3','cup_1_4','tbsp_1','tbsp_1_2','tsp_1','tsp_1_2','tsp_1_4','g','kg'],
  acucar_cristal:  ['cup_1','cup_1_2','cup_1_4','tbsp_1','tsp_1','g','kg'],
  acucar_mascavo:  ['cup_1','cup_1_2','cup_1_4','tbsp_1','tsp_1','g','kg'],
  chocolate_po:    ['cup_1','cup_1_2','cup_1_4','tbsp_1','tsp_1','g','kg'],
  canela_po:       ['tbsp_1','tsp_1','tsp_1_2','tsp_1_4','g'],
  mel:             ['cup_1','cup_1_2','cup_1_4','tbsp_1','tsp_1','g','kg'],
  queijo_ralado:   ['cup_1','cup_1_2','cup_1_4','tbsp_1','tsp_1','g','kg'],
  manteiga:        ['cup_1','cup_1_2','cup_1_4','tbsp_1','tsp_1','g','kg'],
  fermento:        ['tbsp_1','tsp_1','tsp_1_2','tsp_1_4','g'],
  ovo:             ['unit'],
  outro:           ['g','kg','ml','l','unit','cup_1','cup_1_2','tbsp_1','tsp_1'],
};

// Tabela de conversão: tipo → medida → valor na unidade base
export const CONVERSOES: Record<string, { unidadeBase: 'g' | 'ml' | 'unit'; medidas: Record<string, number> }> = {
  liquido: {
    unidadeBase: 'ml',
    medidas: { cup_1:240, cup_3_4:180, cup_2_3:160, cup_1_2:120, cup_1_3:80, cup_1_4:60,
               tbsp_1:15, tbsp_1_2:7.5, tsp_1:5, tsp_1_2:2.5, tsp_1_4:1.25, ml:1, l:1000 },
  },
  farinha_trigo: {
    unidadeBase: 'g',
    medidas: { cup_1:120, cup_3_4:90, cup_2_3:80, cup_1_2:60, cup_1_3:40, cup_1_4:30,
               tbsp_1:8, tbsp_1_2:4, tsp_1:3, tsp_1_2:1.5, tsp_1_4:0.75, g:1, kg:1000 },
  },
  acucar_refinado: {
    unidadeBase: 'g',
    medidas: { cup_1:200, cup_3_4:150, cup_2_3:135, cup_1_2:100, cup_1_3:65, cup_1_4:50,
               tbsp_1:12.5, tbsp_1_2:6.25, tsp_1:4, tsp_1_2:2, tsp_1_4:1, g:1, kg:1000 },
  },
  acucar_cristal: {
    unidadeBase: 'g',
    medidas: { cup_1:190, cup_1_2:95, cup_1_4:48, tbsp_1:12, tsp_1:4, g:1, kg:1000 },
  },
  acucar_mascavo: {
    unidadeBase: 'g',
    medidas: { cup_1:220, cup_1_2:110, cup_1_4:55, tbsp_1:14, tsp_1:4.5, g:1, kg:1000 },
  },
  chocolate_po: {
    unidadeBase: 'g',
    medidas: { cup_1:100, cup_1_2:50, cup_1_4:25, tbsp_1:6, tsp_1:2, g:1, kg:1000 },
  },
  canela_po: {
    unidadeBase: 'g',
    medidas: { tbsp_1:8, tsp_1:2.6, tsp_1_2:1.3, tsp_1_4:0.65, g:1 },
  },
  mel: {
    unidadeBase: 'g',
    medidas: { cup_1:340, cup_1_2:170, cup_1_4:85, tbsp_1:21, tsp_1:7, g:1, kg:1000 },
  },
  queijo_ralado: {
    unidadeBase: 'g',
    medidas: { cup_1:80, cup_1_2:40, cup_1_4:20, tbsp_1:5, tsp_1:2, g:1, kg:1000 },
  },
  manteiga: {
    unidadeBase: 'g',
    medidas: { cup_1:227, cup_1_2:113, cup_1_4:57, tbsp_1:14, tsp_1:5, g:1, kg:1000 },
  },
  fermento: {
    unidadeBase: 'g',
    medidas: { tbsp_1:12, tsp_1:4, tsp_1_2:2, tsp_1_4:1, g:1 },
  },
  ovo: {
    unidadeBase: 'unit',
    medidas: { unit:1 },
  },
  outro: {
    unidadeBase: 'g',
    medidas: { g:1, kg:1000, ml:1, l:1000, unit:1,
               cup_1:240, cup_1_2:120, tbsp_1:15, tsp_1:5 },
  },
};

// Unidades de compra disponíveis por tipo
export const UNIDADES_COMPRA_POR_TIPO: Record<string, string[]> = {
  liquido:         ['ml', 'L', 'unidade'],
  farinha_trigo:   ['g', 'kg', 'pacote'],
  acucar_refinado: ['g', 'kg', 'pacote'],
  acucar_cristal:  ['g', 'kg', 'pacote'],
  acucar_mascavo:  ['g', 'kg', 'pacote'],
  chocolate_po:    ['g', 'kg', 'pacote'],
  canela_po:       ['g', 'pacote'],
  mel:             ['g', 'kg', 'ml', 'L'],
  queijo_ralado:   ['g', 'kg'],
  manteiga:        ['g', 'kg', 'unidade'],
  fermento:        ['g', 'pacote'],
  ovo:             ['unidade', 'dúzia', 'bandeja'],
  outro:           ['g', 'kg', 'ml', 'L', 'unidade', 'pacote', 'caixa'],
};

// Converte unidade de compra para unidade base
const COMPRA_PARA_BASE: Record<string, number> = {
  g: 1, kg: 1000, ml: 1, L: 1000, l: 1000,
  unidade: 1, 'dúzia': 12, bandeja: 30, pacote: 1, caixa: 1,
};

// Converte unidade de compra para unidade base do tipo (g ou ml)
// Retorna quantas unidades base existem na unidade de compra
function converterUnidadeCompraParaBase(
  unidadeCompra: string,
  quantidadeComprada: number,
  unidadeBase: 'g' | 'ml' | 'unit',
): number {
  const uc = unidadeCompra.toLowerCase().trim();

  // Peso → g
  if (unidadeBase === 'g') {
    if (uc === 'g') return quantidadeComprada;
    if (uc === 'kg') return quantidadeComprada * 1000;
    if (uc === 'pacote' || uc === 'caixa' || uc === 'unidade') return quantidadeComprada; // assume g directamente
    return quantidadeComprada;
  }

  // Volume → ml
  if (unidadeBase === 'ml') {
    if (uc === 'ml') return quantidadeComprada;
    if (uc === 'l' || uc === 'litro' || uc === 'litros') return quantidadeComprada * 1000;
    if (uc === 'unidade' || uc === 'pacote') return quantidadeComprada; // assume ml directamente
    return quantidadeComprada;
  }

  // Unidade → unit
  return quantidadeComprada;
}

export interface ResultadoConversao {
  quantidadeConvertida: number;
  unidadeBase: string;
  custoEstimado: number;
  custoPorUnidadeBase: number;
}

export function calcularCustoInsumoReceita(
  tipoKey: string,
  medidaKey: string,
  quantidadeUsada: number,
  precoCompra: number,
  quantidadeComprada: number,
  unidadeCompra: string,
): ResultadoConversao | null {
  const config = CONVERSOES[tipoKey];
  if (!config) return null;

  const valorMedida = config.medidas[medidaKey];
  if (valorMedida === undefined) return null;

  // Passo 1: converter medida caseira → unidade base (g, ml, unit)
  const qtdUsadaBase = quantidadeUsada * valorMedida;

  // Passo 2: converter unidade de compra → mesma unidade base
  const qtdCompradaBase = converterUnidadeCompraParaBase(
    unidadeCompra, quantidadeComprada, config.unidadeBase
  );

  if (qtdCompradaBase <= 0) return null;

  // Passo 3: custo por unidade base
  const custoPorBase = precoCompra / qtdCompradaBase;

  // Passo 4: custo da quantidade usada
  const custoEstimado = qtdUsadaBase * custoPorBase;

  return {
    quantidadeConvertida: qtdUsadaBase,
    unidadeBase: config.unidadeBase,
    custoEstimado,
    custoPorUnidadeBase: custoPorBase,
  };
}

export function getMedidasParaTipo(tipoKey: string) {
  const keys = MEDIDAS_POR_TIPO[tipoKey] ?? MEDIDAS_POR_TIPO['outro'];
  return MEDIDAS_RECEITA.filter(m => keys.includes(m.key));
}

export function getUnidadesCompraParaTipo(tipoKey: string): string[] {
  return UNIDADES_COMPRA_POR_TIPO[tipoKey] ?? UNIDADES_COMPRA_POR_TIPO['outro'];
}
