import {ICurrencyRatesProvider} from "../interfaces/currency-rates.provider";
import {currencyRatesCollection} from "../../offline/currencies.db";
import {injectable} from "inversify";
import {parseToTimestamp} from "../utils/parse-to-timestamp";
import {EmptyCurrencyRatesProvider} from "./empty-currency-rates.provider";
import {ICollection} from "@vitologi/local-db";
import {ICurrencyRateDto} from "../dtos/currency-rate.dto";

@injectable()
export class CurrencyRatesService {
  private _provider: ICurrencyRatesProvider = new EmptyCurrencyRatesProvider();
  private deferredRequests: ((err: unknown) => void)[] = [];
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

    // try to get rate from local db
    let rateDto = await this.collection.findOne({timestamp: timestampKey});

    // if there is no rates on date then return promise of exact rate
    if (!rateDto) {
      const result = new Promise<number>((resolve,reject) => {
        const resolveHandler = (err?: unknown) => {
          this.deferredRequests.splice(this.deferredRequests.indexOf(resolveHandler), 1);

          if(err)
            return reject(err);

          return resolve(this.getExchangeRate(props));
        }
        this.deferredRequests.push(resolveHandler);
      });

      // try to obtain it from outer source
      if (!this.requestedTimestamp.has(timestampKey)) {
        this.requestedTimestamp.set(timestampKey, true);

        try {
          rateDto = await this.provider.getExchangeRates(date);

          if (rateDto) {
            // save or cache received rates
            await this.collection.insertOne(rateDto);
            this.notifyDeferrerRequests();
          }
        } catch (err) {
          this.requestedTimestamp.delete(timestampKey);
          this.notifyDeferrerRequests(err);
        }
      }

      return result;
    }

    const sourceRate = rateDto.rates[from];
    const targetRate = rateDto.rates[to];
    const crossRate = targetRate / sourceRate;

    return crossRate;
  }

  private notifyDeferrerRequests(err?: unknown): void {
    this.deferredRequests.forEach((handler) => handler(err));
  }
}
