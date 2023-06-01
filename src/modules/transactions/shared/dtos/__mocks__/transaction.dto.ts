import {TransactionType} from "../../enums/transaction-type";
import {ITransactionDto} from "../transaction.dto";

export const transactionDto: ITransactionDto = {
  _id: '_id',
  _date: new Date('01-01-2023').getTime(),
  type: TransactionType.Deposit,
  portfolio: null,
  exchange: null,
  operations: [],
}
