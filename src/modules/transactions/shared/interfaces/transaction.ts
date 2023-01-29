import {TransactionType} from "../enums/transaction-type";
import {IOperation} from "./operation";

export interface ITransaction {
  type: TransactionType;
  portfolio: string | null;
  exchange: string | null; // exchange MIC
  operations: IOperation[];
  date: Date;
  forward: IOperation | null;
  backward: IOperation | null;
  commission: IOperation | null;
  tax: IOperation | null;
}
