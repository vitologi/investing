import {OperationType} from "../enums/operation-type";
import {OperationDirection} from "../enums/operation-direction";

export interface IFormOperation {
  type: OperationType;
  assetType: string;  // id of assetType
  name: string;
  direction: OperationDirection;
  amount: number;
}
