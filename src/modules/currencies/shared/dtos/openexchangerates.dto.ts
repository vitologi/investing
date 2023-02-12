export interface IOpenexchangeratesDto {
  disclaimer: string;
  license: string;
  timestamp: number;
  base: string;
  rates: {
    [key: string]: number;
  }
}
