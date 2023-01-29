import {IOperationDto} from "../dtos/operation.dto";
import {IFormOperation} from "../interfaces/form-operation";

export function operationDto2OperationForm(value: IOperationDto): IFormOperation {
  const {type, assetType,name,amount,direction} = value;
  return {
    type: type,
    assetType: assetType || '',
    name: name || '',
    amount: amount,
    direction: direction,
  };
}
