import {OperationType} from "../enums/operation-type";
import {OperationDirection} from "../enums/operation-direction";
import {IOperationDto} from "../dtos/operation.dto";

export interface IOperation {
  type: OperationType;
  assetType: string | null;  // id of assetType
  name: string | null;
  direction: OperationDirection;
  amount: number;

  asDto: IOperationDto;

  setAssetType(value: string | null): void;

  setName(value: string | null): void;

  setDirection(value: OperationDirection): void;

  setAmount(value: number): void;

  updateFromDto(dto: IOperationDto): void;

  pipe(amount: number): number;
}
