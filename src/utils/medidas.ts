export interface Medida {
  id: string;
  label: string;
  nome: string;
  valueMl: number;
  aproximada?: boolean;
}

export interface IngredienteMedida {
  key: string;
  nome: string;
  unidade: 'g' | 'ml';
  conversoes: Partial<Record<string, number>>;
}

export const MEDIDAS_PADRAO: Medida[] = [
  { id: 'cup_1',    label: '1 cup',      nome: '1 chavena',           valueMl: 240 },
  { id: 'cup_3_4',  label: '3/4 cup',    nome: '3/4 chavena',         valueMl: 180 },
  { id: 'cup_2_3',  label: '2/3 cup',    nome: '2/3 chavena',         valueMl: 160 },
  { id: 'cup_1_2',  label: '1/2 cup',    nome: '1/2 chavena',         valueMl: 120 },
  { id: 'cup_1_3',  label: '1/3 cup',    nome: '1/3 chavena',         valueMl: 80  },
  { id: 'cup_1_4',  label: '1/4 cup',    nome: '1/4 chavena',         valueMl: 60  },
  { id: 'tbsp_1',   label: '1 tbsp',     nome: '1 colher de sopa',    valueMl: 15  },
  { id: 'tbsp_1_2', label: '1/2 tbsp',   nome: '1/2 colher de sopa',  valueMl: 7.5 },
  { id: 'tsp_1',    label: '1 tsp',      nome: '1 colher de cha',     valueMl: 5   },
  { id: 'tsp_1_2',  label: '1/2 tsp',    nome: '1/2 colher de cha',   valueMl: 2.5 },
  { id: 'tsp_1_4',  label: '1/4 tsp',    nome: '1/4 colher de cha',   valueMl: 1.25 },
  { id: 'pitada',   label: 'Pitada',     nome: 'Pitada',              valueMl: 0,   aproximada: true },
  { id: 'unidade',  label: 'Unidade',    nome: 'Unidade',             valueMl: 0,   aproximada: true },
];

export const INGREDIENTES_MEDIDAS: IngredienteMedida[] = [
  {
    key: 'farinha_trigo', nome: 'Farinha de trigo', unidade: 'g',
    conversoes: { cup_1: 120, cup_3_4: 90, cup_2_3: 80, cup_1_2: 60, cup_1_3: 40, cup_1_4: 30, tbsp_1: 8, tsp_1: 3 },
  },
  {
    key: 'acucar_refinado', nome: 'Acucar refinado', unidade: 'g',
    conversoes: { cup_1: 200, cup_3_4: 150, cup_2_3: 135, cup_1_2: 100, cup_1_3: 65, cup_1_4: 50, tbsp_1: 12.5, tsp_1: 4 },
  },
  {
    key: 'acucar_mascavo', nome: 'Acucar mascavo', unidade: 'g',
    conversoes: { cup_1: 220, cup_1_2: 110, cup_1_4: 55, tbsp_1: 14, tsp_1: 4.5 },
  },
  {
    key: 'manteiga', nome: 'Manteiga / Margarina', unidade: 'g',
    conversoes: { cup_1: 227, cup_1_2: 113, cup_1_4: 57, tbsp_1: 14, tsp_1: 5 },
  },
  {
    key: 'leite', nome: 'Leite', unidade: 'ml',
    conversoes: { cup_1: 240, cup_1_2: 120, cup_1_4: 60, tbsp_1: 15, tsp_1: 5 },
  },
  {
    key: 'agua', nome: 'Agua', unidade: 'ml',
    conversoes: { cup_1: 240, cup_1_2: 120, cup_1_4: 60, tbsp_1: 15, tsp_1: 5 },
  },
  {
    key: 'oleo', nome: 'Oleo', unidade: 'ml',
    conversoes: { cup_1: 240, cup_1_2: 120, cup_1_4: 60, tbsp_1: 15, tsp_1: 5 },
  },
  {
    key: 'chocolate_po', nome: 'Chocolate em po / Cacau', unidade: 'g',
    conversoes: { cup_1: 100, cup_1_2: 50, cup_1_4: 25, tbsp_1: 6, tsp_1: 2 },
  },
  {
    key: 'fermento', nome: 'Fermento em po', unidade: 'g',
    conversoes: { tbsp_1: 12, tsp_1: 4, tsp_1_2: 2, tsp_1_4: 1 },
  },
  {
    key: 'leite_condensado', nome: 'Leite condensado', unidade: 'g',
    conversoes: { cup_1: 306, cup_1_2: 153, tbsp_1: 19 },
  },
  {
    key: 'natas', nome: 'Natas / Creme de leite', unidade: 'ml',
    conversoes: { cup_1: 240, cup_1_2: 120, cup_1_4: 60, tbsp_1: 15 },
  },
  {
    key: 'ovos', nome: 'Ovos', unidade: 'g',
    conversoes: { unidade: 50 },
  },
];

export function converterMedida(
  medidaId: string,
  quantidade: number,
  ingredienteKey?: string
): { valor: number; unidade: string; aproximada: boolean } | null {
  const medida = MEDIDAS_PADRAO.find(m => m.id === medidaId);
  if (!medida) return null;

  if (medida.aproximada) {
    return { valor: 0, unidade: '?', aproximada: true };
  }

  // Com ingrediente — converte para g ou ml específico
  if (ingredienteKey) {
    const ing = INGREDIENTES_MEDIDAS.find(i => i.key === ingredienteKey);
    if (ing && ing.conversoes[medidaId] !== undefined) {
      return {
        valor: quantidade * ing.conversoes[medidaId]!,
        unidade: ing.unidade,
        aproximada: false,
      };
    }
  }

  // Sem ingrediente — converte apenas para ml
  if (medida.valueMl > 0) {
    return { valor: quantidade * medida.valueMl, unidade: 'ml', aproximada: false };
  }

  return null;
}
