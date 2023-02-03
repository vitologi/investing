export const roundTo = (value: number, digits = 2): number => {
  return Math.round((value + Number.EPSILON) * 100) / Math.pow(10, digits);
}
