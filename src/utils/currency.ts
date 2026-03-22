export function formatMT(value: number): string {
  return `${value.toFixed(2).replace('.', ',')} MT`;
}

export function formatMTShort(value: number): string {
  return `${Math.round(value)} MT`;
}
