/**
 * Converts a date or timestamp to a timestamp with only the year, month, and day.
 * @param input The date or timestamp to be converted.
 * Can be a number (timestamp in milliseconds), a string (in the format 'YYYY-MM-DD'), or a Date object.
 * If not provided, the current date will be used.
 * @returns The timestamp with only the year, month, and day.
 */
export function parseToTimestamp(input: number | string | Date = new Date()): number {
  const date = new Date(input);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}
