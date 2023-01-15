import {ITransactionDto} from "../dtos/transaction.dto";
import {IFormData} from "../interfaces/form-data";

export function dtoToFormData(value: ITransactionDto): IFormData {
 return {
   id: value._id,
   date: new Date(value._date).toString(),
   assetType: value.assetType || '',
   security: value.security || '',
   action: value.action,
   quantity: value.quantity,
   price: value.price,
   commission: value.commission,
   currency: value.currency || '',
   portfolio: value.portfolio || '',
   exchange: value.exchange || '',
 };
}
