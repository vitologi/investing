import {
  ENABLED_CURRENCIES,
  OPEN_EXCHANGE_RATES_API_TOKEN,
  RATE_PROVIDER
} from "../../../modules/currencies/store/currencies.store";
import {CurrencyRateProvider} from "../../../modules/currencies/shared/enums/currency-rate-provider";

export class StorageService {
  get = jest.fn((key)=>{
    switch (key){
      case ENABLED_CURRENCIES:
        return [];
      case RATE_PROVIDER:
        return CurrencyRateProvider.Empty;
      case OPEN_EXCHANGE_RATES_API_TOKEN:
        return 'token';
    }
  })
  set = jest.fn();
}
