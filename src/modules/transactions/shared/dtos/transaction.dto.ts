import {TransactionType} from "../enums/transaction-type";
import {IOperationDto} from "./operation.dto";

export interface ITransactionDto {
  _id: string;
  _date: number;  // ms
  type: TransactionType;
  portfolio: string | null;
  exchange: string | null; // exchange MIC
  operations: IOperationDto[];
}
