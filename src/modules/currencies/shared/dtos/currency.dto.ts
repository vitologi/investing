export interface ICurrencyDto {
  _id: string;  // is the same as code
  name: string;
  symbol_native: string;
  symbol: string;
  code: string;
  name_plural: string;
  rounding: number;
  decimal_digits: number;
}
