export const roundTo = (value: number, digits = 2): number => {
  return Math.round((value + Number.EPSILON) * Math.pow(10, digits)) / Math.pow(10, digits);
}
