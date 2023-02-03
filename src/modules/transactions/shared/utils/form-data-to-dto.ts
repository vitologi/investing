import {ITransactionDto} from "../dtos/transaction.dto";
import {IFormTransaction} from "../interfaces/form-transaction";

export function formDataToDto(value: IFormTransaction): ITransactionDto {
  const {id, date, type,  exchange, portfolio, operations} = value;

  return {
    _id: id,
    _date: (new Date(date)).getTime(),
    type,
    portfolio: portfolio === '' ? null : portfolio,
    exchange: exchange === '' ? null : exchange,
    operations: operations.map((item)=>({
      type: item.type,
      assetType: item.assetType === '' ? null : item.assetType,
      name: item.name === '' ? null : item.name,
      amount: item.amount,
      direction: item.direction,
    })),
  };
}
