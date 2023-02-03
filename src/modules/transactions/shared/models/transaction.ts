import {Model} from "../../../../shared/models/model";
import {ITransactionDto} from "../dtos/transaction.dto";
import {TransactionsStore} from "../../store/transactions.store";
import {action, computed, makeObservable, observable} from "mobx";
import {TransactionType} from "../enums/transaction-type";
import {SystemAssetTypes} from "../../../asset-types/shared/enums/system-asset-types";
import {ITransaction} from "../interfaces/transaction";
import {IOperation} from "../interfaces/operation";
import {OperationType} from "../enums/operation-type";
import {Operation} from "./operation";
import {getDefaultOperations} from "../utils/get-default-operations";

export class Transaction extends Model<ITransactionDto, TransactionsStore> implements ITransaction {
  _date = (new Date()).getTime();
  type: TransactionType = TransactionType.Deposit;
  portfolio: string | null = null;
  exchange: string | null = null;

  operations: IOperation[] = getDefaultOperations(this.type)
    .map((operationDto) => {
      const operation = new Operation();
      operation.updateFromDto(operationDto);
      return operation;
    });

  constructor(protected store: TransactionsStore, id?: string) {
    super(store, id);
    makeObservable(this, {
      _date: observable,
      type: observable,
      portfolio: observable,
      exchange: observable,
      operations: observable,
      date: computed,

      operationByType: computed,
      forward: computed,
      backward: computed,
      commission: computed,
      tax: computed,

      assetType: computed,
      security: computed,
      quantity: computed,
      price: computed,
      currency: computed,
      isCurrency: computed,
      bookTotal: computed,
      total: computed,
      applyOperations: action,
    });
  }

  get assetType(): string | null {
    return this.forward ? this.forward.assetType : null;
  }

  get security(): string | null {
    return this.forward ? this.forward.name : null;
  }

  get quantity(): number {
    return this.forward ? this.forward.amount : 0;
  }

  get currency(): string | null {
    const operation = this.type === TransactionType.Deposit ? this.forward : this.backward;
    return operation ? operation.name : null;
  }

  get date(): Date {
    return new Date(this._date);
  }

  set date(value: Date) {
    this._date = value.getTime();
  }

  get operationByType(): (type: OperationType) => IOperation | null {
    return (type: OperationType) => this.operations.find((item) => item.type === type) || null;
  }

  get forward() {
    // return this.operations.find((item) => item.type === OperationType.Forward) || null;
    return this.operationByType(OperationType.Forward);
  }

  get backward() {
    // return this.operations.find((item) => item.type === OperationType.Backward) || null;
    return this.operationByType(OperationType.Backward);
  }

  get commission() {
    return this.operationByType(OperationType.Commission);
  }

  get tax() {
    return this.operationByType(OperationType.Tax);
  }


  /**
   * @deprecated
   */
  get isCurrency() {
    return this.forward && this.forward.assetType === SystemAssetTypes.CURRENCY;
  }

  get price(): number {
    return (this.backward?.amount || 0) / (this.forward?.amount || 1);
  }

  get bookTotal(): number {
    return (this.backward ? this.backward.amount : 0);
  }

  get total(): number {
    const operations = this.type === TransactionType.Deposit ? [this.forward] : [this.backward, this.commission];
    return this.applyOperations(operations);
  }

  get asDto(): ITransactionDto {
    return {
      _id: this.id,
      _date: this._date,
      type: this.type,
      portfolio: this.portfolio,
      exchange: this.exchange,
      operations: this.operations.map((item) => item.asDto),
    };
  }

  dispose(): void {
  }

  protected initialize(): void {
  }

  updateFromDto(dto: ITransactionDto): void {
    this._date = dto._date;
    this.type = dto.type;
    this.portfolio = dto.portfolio;
    this.exchange = dto.exchange;
    this.operations.length = 0;
    this.operations.push(...dto.operations.map((operationDto) => {
      const operation = new Operation();
      operation.updateFromDto(operationDto);
      return operation;
    }));
  }

  applyOperations(operations: (IOperation | null)[]): number {
    const isOperation = (operation: IOperation | null): operation is IOperation => operation !== null;
    return operations
      .filter(isOperation)
      .reduce((total, operation) => operation.pipe(total), 0);
  }
}
