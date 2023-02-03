import {ITransactionDto} from "../dtos/transaction.dto";
import {IFormTransaction} from "../interfaces/form-transaction";
import {operationDto2OperationForm} from "./operation-dto-2-operation-form";

export function transactionDto2TransactionForm(value: ITransactionDto): IFormTransaction {
  const {_id, _date, type, portfolio, exchange, operations} = value;
  return {
    id: _id,
    date: new Date(_date).toString(),
    type,
    portfolio: portfolio || '',
    exchange: exchange || '',
    operations: operations.map(operationDto2OperationForm),
  };
}
