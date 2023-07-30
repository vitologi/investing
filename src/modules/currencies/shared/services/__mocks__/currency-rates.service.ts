import {EmptyCurrencyRatesProvider} from "../empty-currency-rates.provider";
import {injectable} from "inversify";

@injectable()
export class CurrencyRatesService {
  static key = Symbol.for('CurrencyRatesService');
  provider = new EmptyCurrencyRatesProvider();
  setProvider = jest.fn();
  getExchangeRate = jest.fn().mockResolvedValue(1);
  getDeferredResult = jest.fn();
  notifyDeferrerRequests = jest.fn();
}
