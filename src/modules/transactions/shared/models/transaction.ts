import {Model} from "../../../../shared/models/model";
import {ITransactionDto} from "../dtos/transaction.dto";
import {TransactionsStore} from "../../store/transactions.store";
import {action, computed, makeObservable, observable} from "mobx";
import {TransactionAction} from "../enums/transaction-action";
import {AssetType} from "../../../asset-types/shared/models/asset-type";
import {Portfolio} from "../../../portfolios/shared/models/portfolio";
import {Exchange} from "../../../exchanges/shared/models/exchange";
import {Currency} from "../../../currencies/shared/models/currency";

export class Transaction extends Model<ITransactionDto, TransactionsStore> {
  _date = (new Date()).getTime();
  assetType: string | null = null;
  security: string | null = null;
  action: TransactionAction = TransactionAction.Deposit;
  quantity = 0;
  price = 0;
  commission = 0;
  currency: string | null = null;
  portfolio: string | null = null;
  exchange: string | null = null;


  constructor(protected store: TransactionsStore, id?: string) {
    super(store, id);
    makeObservable(this, {
      _date: observable,
      assetType: observable,
      security: observable,
      action: observable,
      quantity: observable,
      price: observable,
      commission: observable,
      currency: observable,
      portfolio: observable,
      exchange: observable,
      date: computed,
      isPositive: computed,
      bookTotal: computed,
      adjustments: computed,
      total: computed,
      amountPipe: action,
      currencyPipe: action,
      setAssetType: action,
      setPortfolio: action,
      setExchange: action,
      setCurrency: action,
    });
  }

  get date(): Date {
    return new Date(this._date);
  }

  set date(value: Date) {
    this._date = value.getTime();
  }

  get isPositive(): boolean {
    switch (this.action) {
      case TransactionAction.Deposit:
      case TransactionAction.Sell:
      case TransactionAction.Dividend:
      case TransactionAction.Coupon:
      case TransactionAction.DRIP:
        return true;

      case TransactionAction.Buy:
      case TransactionAction.Withdrawal:
      case TransactionAction.Loss:
      default:
        return false;
    }
  }

  get bookTotal(): number {
    return this.price * this.quantity;
  }

  get adjustments(): number {
    return this.commission * ([
      TransactionAction.Dividend,
      TransactionAction.Sell,
      TransactionAction.Deposit,
      TransactionAction.Coupon,
    ].includes(this.action) ? -1 : 1);
  }

  get total(): number {
    return this.bookTotal + this.adjustments;
  }

  get asDto(): ITransactionDto {
    return {
      _id: this.id,
      _date: this._date,
      assetType: this.assetType,
      security: this.security,
      action: this.action,
      quantity: this.quantity,
      price: this.price,
      commission: this.commission,
      currency: this.currency,
      portfolio: this.portfolio,
      exchange: this.exchange,
    };
  }


  setAssetType(value: AssetType | null): void {
    this.assetType = value ? value.id : null;
  }

  setPortfolio(value: Portfolio | null): void {
    this.portfolio = value ? value.id : null;
  }

  setExchange(value: Exchange | null): void {
    this.exchange = value ? value.id : null;
  }

  setCurrency(value: Currency | null): void {
    this.currency = value ? value.id : null;
  }

  dispose(): void {
  }

  protected initialize(): void {
  }

  updateFromDto(dto: ITransactionDto): void {
    this._date = dto._date;
    this.assetType = dto.assetType;
    this.security = dto.security;
    this.action = dto.action;
    this.quantity = dto.quantity;
    this.price = dto.price;
    this.commission = dto.commission;
    this.currency = dto.currency;
    this.portfolio = dto.portfolio;
    this.exchange = dto.exchange;
  }

  // isCurrency(){
  //   return this.store.isCurrency(this.security);
  // }
  //
  // totalInCurrency(targetSumbol = "USD"){
  //   return this.total*this.store.getExchangeRate(targetSumbol, this.currency, this.date);
  // }

  // clone(){
  //   return new Transaction([
  //     this._date,
  //     this.type,
  //     this.security,
  //     this.currency,
  //     this.action,
  //     this.quantity,
  //     this.price,
  //     this.comission,
  //     this.account,
  //   ],this.exchange);
  // }

  amountPipe(initial: number): number {
    switch (this.action) {
      case TransactionAction.Buy:
        return initial + this.quantity;

      case TransactionAction.Withdrawal:
      case TransactionAction.Sell:
        return initial - this.quantity;

      default:
        return initial;
    }
  }

  currencyPipe(initial: number): number {
    switch (this.action) {
      case TransactionAction.Buy:
        return initial - this.total;

      case TransactionAction.Deposit:
      case TransactionAction.Coupon:
      case TransactionAction.Dividend:
      case TransactionAction.Sell:
        return initial + this.total;

      default:
        return initial;
    }
  }
}
