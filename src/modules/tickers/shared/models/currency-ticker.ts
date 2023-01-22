import {TickersStore} from "../../store/tickers.store";
import {computed, makeObservable} from "mobx";
import {Ticker} from "./ticker";
import {Transaction} from "../../../transactions/shared/models/transaction";

export class CurrencyTicker extends Ticker {
  constructor(protected store: TickersStore, id?: string) {
    super(store, id);
    makeObservable(this, {
      oppositeTransactions: computed,
    });
  }

  get oppositeTransactions(): Transaction[] {
    return this.store.transactionsStore.list
      .filter((item) => item.currency === this._currency);
  }

  amountOnDate(date = new Date()) {
    const finalDate = new Date(date);
    const generalAmount = super.amountOnDate(date);
    const oppositeAmount = this.oppositeTransactions
      .filter((transaction) => transaction.date <= finalDate)
      .reduce((amount, transaction) => {
        return transaction.amountPipe(amount);
      }, 0);

    return generalAmount + oppositeAmount;
  }
}
