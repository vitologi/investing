import {TransactionAction} from "../enums/transaction-action";

export interface ITransactionDto {
  _id: string;
  _date: number;  // ms
  assetType: string | null;  // id of assetType
  security: string | null;   // ticker symbol
  action: TransactionAction;
  quantity: number;
  price: number;
  commission: number;
  currency: string | null; // currency code
  portfolio: string | null;
  exchange: string | null; // exchange MIC
}
