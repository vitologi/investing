import {action, computed, makeObservable, observable} from "mobx";
import {OperationType} from "../enums/operation-type";
import {OperationDirection} from "../enums/operation-direction";
import {IOperation} from "../interfaces/operation";
import {IOperationDto} from "../dtos/operation.dto";

export class Operation implements IOperation {
  type = OperationType.Forward;
  assetType: string | null = null;  // id of assetType
  name: string | null = null;
  direction = OperationDirection.Neutral;
  amount = 0;

  constructor() {
    makeObservable(this, {
      type: observable,
      assetType: observable,
      name: observable,
      direction: observable,
      amount: observable,
      asDto: computed,
      updateFromDto: action,
      setAssetType: action,
      setName: action,
      setDirection: action,
      setAmount: action,
      pipe: action,
    })
  }

  get asDto(): IOperationDto {
    return {
      type: this.type,
      assetType: this.assetType,
      name: this.name,
      direction: this.direction,
      amount: this.amount,
    };
  }

  updateFromDto(dto: IOperationDto): void {
    this.type = dto.type;
    this.assetType = dto.assetType;
    this.name = dto.name;
    this.direction = dto.direction;
    this.amount = typeof dto.amount === 'string' ? parseFloat(dto.amount): dto.amount;
  }

  setAssetType(value: string | null):void {
    this.assetType = value;
  }
  setName(value: string | null):void {
    this.name = value;
  }
  setDirection(value: OperationDirection):void {
    this.direction = value;
  }
  setAmount(value: number):void {
    this.amount = value;
  }

  pipe(amount: number): number {
    switch (this.direction) {
      case OperationDirection.Positive:
        return amount + this.amount;

      case OperationDirection.Negative:
        return amount - this.amount;

      case OperationDirection.Neutral:
      default:
        return amount;
    }
  }
}
