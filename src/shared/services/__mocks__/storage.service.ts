import {
  ENABLED_CURRENCIES,
  OPEN_EXCHANGE_RATES_API_TOKEN,
  RATE_PROVIDER
} from "../../../modules/currencies/store/currencies.store";
import {CurrencyRateProvider} from "../../../modules/currencies/shared/enums/currency-rate-provider";
import {ENABLED_EXCHANGES} from "../../../modules/exchanges/store/exchange.store";
import {DEMO_DIALOG_OPENED, MANUAL_INIT} from "../../../modules/manual/store/manual.store";
import {injectable} from "inversify";

@injectable()
export class StorageService {
  static key = Symbol.for('StorageService');
  get = jest.fn((key, defaultValue) => {
    if (defaultValue !== undefined) {
      return defaultValue;
    }

    switch (key) {
      case ENABLED_CURRENCIES:
        return [];
      case RATE_PROVIDER:
        return CurrencyRateProvider.Empty;
      case OPEN_EXCHANGE_RATES_API_TOKEN:
        return 'token';
      case  ENABLED_EXCHANGES:
        return ["XNYS", "XNAS"];
      case  MANUAL_INIT:
        return false;
      case  DEMO_DIALOG_OPENED:
        return true;
    }
  })
  set = jest.fn();
}
