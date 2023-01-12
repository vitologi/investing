import {TransactionAction} from "../enums/transaction-action";

export interface ITransactionDto {
  _id: string;
  _date: number;  // ms
  assetType: string;  // id of assetType
  security: string | null;   // ticker symbol
  action: TransactionAction;
  quantity: number;
  price: number;
  commission: number;
  currency: string;   // currency code
  portfolio: string;
  exchange: string | null; // exchange MIC
}
