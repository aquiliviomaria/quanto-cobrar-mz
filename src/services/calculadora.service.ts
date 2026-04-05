import { ResultadoCalculo } from '../types/orcamento.types';
import { ProdutoInsumo } from '../types/produto.types';

export function calcularCustoProduto(
  insumos: ProdutoInsumo[],
  rendimento: number,
  custo_extra: number
): number {
  const custo_insumos = insumos.reduce((acc, pi) => {
    const custoCalc = (pi as any).custo_calculado;
    // Usa custo_calculado se for um valor positivo válido (guardado correctamente)
    if (custoCalc && custoCalc > 0) {
      return acc + custoCalc;
    }
    // Fallback: custo_unitario já está em MT por unidade de compra
    // Se quantidade_usada está na mesma unidade, multiplica directamente
    // Este fallback só é correcto se não houve conversão de unidades
    return acc + (pi.quantidade_usada * (pi.custo_unitario ?? 0));
  }, 0);
  const rend = rendimento > 0 ? rendimento : 1;
  return (custo_insumos + custo_extra) / rend;
}

export function calcularOrcamento(
  custo_por_unidade: number,
  quantidade: number,
  margem: number,
  arredondar: boolean = true,
  tipo_arredondamento: 'dezena' | 'cinquenta' | 'centena' = 'dezena'
): ResultadoCalculo {
  const custo_total = custo_por_unidade * quantidade;
  const valor_lucro = custo_total * (margem / 100);
  const preco_sugerido = custo_total + valor_lucro;
  const preco_arredondado = arredondar
    ? arredondarPreco(preco_sugerido, tipo_arredondamento)
    : preco_sugerido;

  return { custo_total, valor_lucro, preco_sugerido, preco_arredondado };
}

export function arredondarPreco(
  valor: number,
  tipo: 'dezena' | 'cinquenta' | 'centena'
): number {
  const base = tipo === 'dezena' ? 10 : tipo === 'cinquenta' ? 50 : 100;
  return Math.ceil(valor / base) * base;
}

export function calcularMargens(custo: number): Record<string, number> {
  return {
    '20%': custo * 1.2,
    '30%': custo * 1.3,
    '40%': custo * 1.4,
    '50%': custo * 1.5,
  };
}
