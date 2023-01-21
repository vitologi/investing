import {TransactionAction} from "../enums/transaction-action";

export interface IFormData {
  id: string;
  date: string;
  assetType: string;
  security: string;
  action: TransactionAction;
  quantity: number;
  price: number;
  commission: number;
  currency: string;
  portfolio: string;
  exchange: string;
}
