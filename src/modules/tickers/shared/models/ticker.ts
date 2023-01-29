import {Model} from "../../../../shared/models/model";
import {ITickerDto} from "../dtos/ticker.dto";
import {TickersStore} from "../../store/tickers.store";
import {action, computed, makeObservable} from "mobx";
import {ITicker} from "../interfaces/ticker";
import {Transaction} from "../../../transactions/shared/models/transaction";
import {AssetType} from "../../../asset-types/shared/models/asset-type";
import {Currency} from "../../../currencies/shared/models/currency";

export class Ticker extends Model<ITickerDto, TickersStore> implements ITicker {
  protected _assetType: string | null = null;
  protected _security: string | null = null;
  protected _currency: string | null = null;
  protected _amount = 0;

  constructor(protected store: TickersStore, id?: string) {
    super(store, id);
    makeObservable(this, {
      transactions: computed,
      assetType: computed,
      security: computed,
      currency: computed,
      setAssetType: action,
      setSecurity: action,
      setCurrency: action,
      init: action,
    });
  }

  get assetType(): AssetType {
    if (!this._assetType) {
      throw new Error('Ticker doesnt contain asset type');
    }
    const assetType = this.store.getAssetType(this._assetType);

    if (!assetType) {
      throw new Error('Asset type not found');
    }

    return assetType;
  }

  get security(): string {
    return this._security || '';
  }

  get currency(): Currency | null {
    return this._currency ? this.store.getCurrency(this._currency) : null;
  }

  get transactions(): Transaction[] {
    return this.store.transactionsStore.list.filter((item) => item.security === this.security);
  }

  get amount(): number {
    return this._amount;
  }

  setAssetType(value: string | null): void {
    this._assetType = value;
  }

  setSecurity(value: string): void {
    this._security = value;
  }

  setCurrency(value: string | null): void {
    this._currency = value;
  }

  amountOnDate(date = new Date()) {
    const finalDate = new Date(date);
    return this.transactions
      .filter((transaction) => transaction.date <= finalDate)
      .reduce((amount, transaction) => {
        return transaction.forward ? transaction.forward.pipe(amount) : amount;
      }, 0);
  }

  init(): void {
    this.initialize();
  }

  get asDto(): ITickerDto {
    return {
      _id: this.id,
      assetType: this.assetType.id,
      security: this.security,
      currency: this.currency ? this.currency.code : null,
      amount: this.amount,
    };
  }

  dispose(): void {
  }

  protected initialize(): void {
    this._amount = this.amountOnDate();
  }

  updateFromDto(dto: ITickerDto): void {
    this._assetType = dto.assetType;
    this._security = dto.security;
    this._currency = dto.currency;
    this._amount = dto.amount;
  }

}
