import {ITransactionDto} from "../dtos/transaction.dto";
import {IFormData} from "../interfaces/form-data";

export function formDataToDto(value: IFormData): ITransactionDto {
  const {id, date, action, assetType, commission, currency, exchange, portfolio, price, quantity, security} = value;
  return {
    _id: id,
    _date: (new Date(date)).getTime(),
    action,
    assetType: assetType,
    currency: currency,
    portfolio: portfolio,
    price,
    quantity,
    commission,
    security,
    exchange,
  };
}
