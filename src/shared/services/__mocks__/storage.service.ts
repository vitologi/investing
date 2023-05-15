import {
  ENABLED_CURRENCIES,
  OPEN_EXCHANGE_RATES_API_TOKEN,
  RATE_PROVIDER
} from "../../../modules/currencies/store/currencies.store";
import {CurrencyRateProvider} from "../../../modules/currencies/shared/enums/currency-rate-provider";
import {ENABLED_EXCHANGES} from "../../../modules/exchanges/store/exchange.store";

export class StorageService {
  get = jest.fn((key)=>{
    switch (key){
      case ENABLED_CURRENCIES:
        return [];
      case RATE_PROVIDER:
        return CurrencyRateProvider.Empty;
      case OPEN_EXCHANGE_RATES_API_TOKEN:
        return 'token';
      case  ENABLED_EXCHANGES:
        return ["XNYS", "XNAS"];
    }
  })
  set = jest.fn();
}
