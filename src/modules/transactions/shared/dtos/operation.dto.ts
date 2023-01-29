import {OperationType} from "../enums/operation-type";
import {OperationDirection} from "../enums/operation-direction";

export interface IOperationDto {
  type: OperationType;
  assetType: string | null;  // id of assetType
  name: string | null;
  direction: OperationDirection;
  amount: number;
}
