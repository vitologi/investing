import {Model} from "../../../../shared/models/model";
import {ITransactionDto} from "../dtos/transaction.dto";
import {TransactionsStore} from "../../store/transactions.store";
import {computed, makeObservable, observable} from "mobx";
import {TransactionAction} from "../enums/transaction-action";

export class Transaction extends Model<ITransactionDto, TransactionsStore>{
  _date = (new Date()).getTime();
  assetType: string | null = null;
  security: string | null = null;
  action: TransactionAction = TransactionAction.Deposit;
  quantity= 0;
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
    });
  }

  get date() : Date {
    return new Date(this._date);
  }

  set date(value: Date){
    this._date = value.getTime();
  }

  get isPositive(): boolean {
    switch (this.action){
      case TransactionAction.Deposit:
      case TransactionAction.Buy:
      case TransactionAction.Dividend:
      case TransactionAction.Coupon:
      case TransactionAction.DRIP:
        return true;


      case TransactionAction.Withdrawal:
      case TransactionAction.Sell:
      case TransactionAction.Loss:
      default:
        return false;
    }
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
}
