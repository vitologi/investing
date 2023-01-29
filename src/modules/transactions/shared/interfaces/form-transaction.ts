import {TransactionType} from "../enums/transaction-type";
import {IFormOperation} from "./form-operation";

export interface IFormTransaction {
  id: string;
  date: string;
  type: TransactionType;
  portfolio: string;
  exchange: string;
  operations: IFormOperation[];
}
