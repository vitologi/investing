import {ICurrencyRatesProvider} from "../interfaces/currency-rates.provider";
import {currencyRatesCollection} from "../../offline/currencies.db";
import {injectable} from "inversify";
import {parseToTimestamp} from "../utils/parse-to-timestamp";
import {EmptyCurrencyRatesProvider} from "./empty-currency-rates.provider";
import {ICollection} from "@vitologi/local-db";
import {ICurrencyRateDto} from "../dtos/currency-rate.dto";

@injectable()
export class CurrencyRatesService {
  static key = Symbol.for('CurrencyRatesService');
  private _provider: ICurrencyRatesProvider = new EmptyCurrencyRatesProvider();
  private deferredRequests: ((handlerTimestampKey: number, value: number, err?: unknown) => void)[] = [];
  private requestedTimestamp = new Map<number, boolean>();
  private collection: ICollection<ICurrencyRateDto>;

  get provider(): ICurrencyRatesProvider {
    return this._provider;
  }

  constructor() {
    this.collection = currencyRatesCollection();
  }

  setProvider(provider: ICurrencyRatesProvider): void {
    this._provider = provider;
  }

  async getExchangeRate(props: { from: string, to: string, date?: Date }): Promise<number> {
    const {from, to, date} = props;
    // use timestamp as a key to find rates
    const timestampKey = parseToTimestamp(date);

    // rates from local db
    let rateDto = await this.collection.findOne({timestamp: timestampKey});
    if (rateDto) {
      return rateDto.rates[to] / rateDto.rates[from];
    }

    const result = this.getDeferredResult(timestampKey);

    // prevent multiple request on the same date
    if (this.requestedTimestamp.has(timestampKey)) {
      return result;
    }

    this.requestedTimestamp.set(timestampKey, true);

    let error;
    try {
      rateDto = await this.provider.getExchangeRates(date);
      if (rateDto) {
        await this.collection.insertOne(rateDto);
      }
    } catch (err) {
      error = err;
    }

    let ratio = 1;
    if(rateDto){
      ratio = rateDto.rates[to] / rateDto.rates[from];
    }

    this.notifyDeferrerRequests(timestampKey, ratio , error);
    this.requestedTimestamp.delete(timestampKey);
    return result;
  }

  async getDeferredResult(timestampKey: number): Promise<number>{
    return new Promise<number>((resolve, reject) => {
      const resolveHandler = (handlerTimestampKey: number, value: number, err?: unknown) => {
        if (handlerTimestampKey !== timestampKey) {
          return;
        }

        this.deferredRequests.splice(this.deferredRequests.indexOf(resolveHandler), 1);

        if (err)
          return reject(err);

        return resolve(value);
      }

      this.deferredRequests.push(resolveHandler);
    });
  }

  notifyDeferrerRequests(handlerTimestampKey: number, value: number, err?: unknown): void {
    for (let i = this.deferredRequests.length - 1; i >= 0; i--) {
      this.deferredRequests[i](handlerTimestampKey, value, err);
    }
  }
}
