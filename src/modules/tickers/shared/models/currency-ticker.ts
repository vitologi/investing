import {TickersStore} from "../../store/tickers.store";
import {computed, makeObservable} from "mobx";
import {Ticker} from "./ticker";
import {Transaction} from "../../../transactions/shared/models/transaction";

export class CurrencyTicker extends Ticker {
  protected _assetType: string | null = null;
  protected _security: string | null = null;
  protected _currency: string | null = null;
  protected _amount = 0;

  constructor(protected store: TickersStore, id?: string) {
    super(store, id);
    makeObservable(this, {
      oppositeTransactions: computed,
    });
  }

  get oppositeTransactions(): Transaction[] {
    return this.store.transactionsStore.list
      .filter((item) => {
        return item.currency === this._security;
      });
  }

  amountOnDate(date = new Date()) {
    const finalDate = new Date(date);
    const generalAmount = super.amountOnDate(date);
    const oppositeAmount = this.oppositeTransactions
      .filter((transaction) => transaction.date <= finalDate)
      .reduce((amount, transaction) => {
        return transaction.backward ? transaction.backward.pipe(amount) : amount;
      }, 0);

    return generalAmount + oppositeAmount;
  }
}
