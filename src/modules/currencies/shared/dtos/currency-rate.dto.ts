export interface ICurrencyRateDto {
  _id: string;
  timestamp: number;
  base: string;
  rates: {
    [key: string]: number;
  }
}
