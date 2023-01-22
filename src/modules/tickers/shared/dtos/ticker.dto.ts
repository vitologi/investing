export interface ITickerDto {
  _id: string;
  assetType: string | null;  // id of assetType
  security: string | null;   // ticker symbol
  currency: string | null;
  amount: number;
}
