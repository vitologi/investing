import {Model} from "../../../../shared/models/model";
import {ITickerDto} from "../dtos/ticker.dto";
import {TickersStore} from "../../store/tickers.store";
import {action, computed, makeObservable, observable} from "mobx";
import {ITicker} from "../interfaces/ticker";
import {AssetType} from "../../../asset-types/shared/models/asset-type";
import {IOperation} from "../../../transactions/shared/interfaces/operation";
import {Operation} from "../../../transactions/shared/models/operation";
import {OperationType} from "../../../transactions/shared/enums/operation-type";
import {OperationDirection} from "../../../transactions/shared/enums/operation-direction";
import {Portfolio} from "../../../portfolios/shared/models/portfolio";

export class Ticker extends Model<ITickerDto, TickersStore> implements ITicker {
  protected _portfolio: string | null = null;
  protected _assetType: string | null = null;
  protected _security: string | null = null;
  _amount = 0;
  _lastSync = 0;
  _opposite: Operation[] = [];

  constructor(protected store: TickersStore, id?: string) {
    super(store, id);
    makeObservable(this, {
      _amount: observable,
      _opposite: observable,
      _lastSync: observable,
      isCurrency: computed,
      lastSync: computed,
      operations: computed,
      portfolio: computed,
      assetType: computed,
      security: computed,
      avgPrice: computed,
      baseCurrencyCode: computed,
      setAssetType: action,
      setSecurity: action,
      amountOnDate: action,
      oppositeOnDate: action,
      init: action,
    });
  }

  get avgPrice(): () => number {
    return (): number => {
      // TODO: refactor it
      const firstOp = this.operations[0];
      if(!firstOp){
        return 0;
      }
      return Math.abs(firstOp.amount / this.amount);
    };
  }

  get isCurrency(): boolean {
    return this._security ? !!this.store.getCurrency(this._security) : false;
  }

  get lastSync(): Date {
    return new Date(this._lastSync);
  }

  get operations(): Operation[] {
    return this._opposite;
  }

  get portfolio(): Portfolio {
    if (!this._portfolio) {
      throw new Error('Ticker does not contain portfolio');
    }
    const portfolio = this.store.getPortfolio(this._portfolio);

    if (!portfolio) {
      throw new Error('Ticker portfolio was not found');
    }

    return portfolio;
  }

  get assetType(): AssetType {
    if (!this._assetType) {
      throw new Error('Ticker does not contain asset type');
    }
    const assetType = this.store.getAssetType(this._assetType);

    if (!assetType) {
      throw new Error('Asset type was not found');
    }

    return assetType;
  }

  get security(): string {
    return this._security || '';
  }

  get amount(): number {
    return this._amount;
  }

  get baseCurrencyCode(): string {
    return this.operations[0].name || 'USD';
  }

  setPortfolio(value: string | null): void {
    this._portfolio = value;
  }

  setAssetType(value: string | null): void {
    this._assetType = value;
  }

  setSecurity(value: string): void {
    this._security = value;
  }

  amountOnDate(date = new Date()): number {
    const finalDate = new Date(date);
    return this.store.transactions
      .filter((transaction) => transaction.date <= finalDate)
      .reduce((amount, transaction) => {
        transaction.operations.forEach((operation) => {
          // TODO: move to handler
          if (
            transaction.portfolio === this.portfolio.id
            && operation.assetType === this._assetType
            && operation.name === this._security
          ) {
            amount = operation.pipe(amount);
          }
        })
        return amount;
      }, 0);
  }

  oppositeOnDate(date = new Date()): Operation[] {
    const finalDate = new Date(date);

    return Array.from(this.store.transactions
      .filter((transaction) => {
        return transaction.date <= finalDate
          && transaction.portfolio === this.portfolio.id
          && transaction.forward !== null
          && transaction.forward.name === this._security
          && transaction.forward.assetType === this._assetType;
      })
      .reduce((acc, transaction) => {
        const opposite = transaction.operations.filter((item) => item !== transaction.forward);
        let opMap: Operation | undefined;

        opposite.forEach((operation) => {
          if (operation.name === null) {
            return;
          }

          // add compose operation
          if (!acc.has(operation.name)) {
            opMap = new Operation();
            opMap.updateFromDto({
              ...operation.asDto,
              type: OperationType.Compose,
              direction: OperationDirection.Neutral,
              amount: 0,
            })
            acc.set(operation.name, opMap);
          }

          opMap = acc.get(operation.name);
          if (!opMap) {
            return;
          }

          opMap.setAmount(operation.pipe(opMap.amount));
        })
        return acc;
      }, new Map<string, IOperation>())
      .values());
  }

  init(): void {
    this._amount = this.amountOnDate();
    this._opposite = this.oppositeOnDate();
  }

  get asDto(): ITickerDto {
    return {
      _id: this.id,
      lastSync: 0,
      portfolio: this.portfolio.id,
      assetType: this.assetType.id,
      name: this.security,
      amount: this.amount,
      opposite: this._opposite.map((item) => item.asDto),
    };
  }

  dispose(): void {
  }

  protected initialize(): void {
  }

  updateFromDto(dto: ITickerDto): void {
    this._lastSync = dto.lastSync;
    this._portfolio = dto.portfolio;
    this._assetType = dto.assetType;
    this._security = dto.name;
    this._amount = dto.amount;
    this._opposite = dto.opposite.map((operationDto) => {
      const model = new Operation();
      model.updateFromDto(operationDto);
      return model;
    })
  }

  isDuplicate(value: ITicker): boolean {
    return value.portfolio.id === this.portfolio.id
      && value.assetType.id === this.assetType.id
      && value.security === this.security;
  }

}
