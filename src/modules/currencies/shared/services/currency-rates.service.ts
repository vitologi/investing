// import Dinero, {Currency as DineroCurrency} from "dinero.js";
import {ICurrencyRatesProvider} from "../interfaces/currency-rates.provider";
import {currencyRatesCollection} from "../../offline/currencies.db";
import {injectable} from "inversify";
import {parseToTimestamp} from "../utils/parse-to-timestamp";
import {EmptyCurrencyRatesProvider} from "./empty-currency-rates.provider";

@injectable()
export class CurrencyRatesService {
  private _provider: ICurrencyRatesProvider = new EmptyCurrencyRatesProvider();
  private deferredRequests: (() => void)[] = [];
  private requestedTimestamp = new Map<number, boolean>();

  get provider(): ICurrencyRatesProvider {
    return this._provider;
  }

  setProvider(provider: ICurrencyRatesProvider): void {
    this._provider = provider;
  }

  async getExchangeRate(props: { from: string, to: string, date?: Date }): Promise<number> {
    const {from, to, date} = props;

    // use timestamp as a key to find rates
    const timestampKey = parseToTimestamp(date);

    // try to get rate from local db
    let rateDto = await currencyRatesCollection.findOne({timestamp: timestampKey});


    // if there is no rates on date then return promise of exact rate
    if (!rateDto) {

      const result = new Promise<number>((resolve) => {
        const resolveHandler = () => {
          resolve(this.getExchangeRate(props));
          this.deferredRequests.splice(this.deferredRequests.indexOf(resolveHandler), 1);
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
            await currencyRatesCollection.insertOne(rateDto);
            this.notifyDeferrerRequests();
          } else {
            throw new Error(`Can't get rates on ${date}`);
          }
        } catch (_) {
          this.requestedTimestamp.delete(timestampKey);
        }

      }

      return result;
    }

    const sourceRate = rateDto.rates[from];
    const targetRate = rateDto.rates[to];
    const crossRate = targetRate / sourceRate;

    return crossRate;
  }

  private notifyDeferrerRequests(): void {
    this.deferredRequests.forEach((handler) => handler());
  }
}
