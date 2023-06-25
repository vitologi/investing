import {ICurrencyRatesProvider} from "../interfaces/currency-rates.provider";
import {ICurrencyRateDto} from "../dtos/currency-rate.dto";
import {IOpenexchangeratesDto} from "../dtos/openexchangerates.dto";
import {parseToTimestamp} from "../utils/parse-to-timestamp";

export class OpenexchangeratesProvider implements ICurrencyRatesProvider {
  private url = 'https://openexchangerates.org/api/historical/DATE_VAR.json?app_id=TOKEN_VAR&show_alternative=false&prettyprint=false'
  private token: string | null = null;

  setSecureToken(token: string): void {
    this.token = token;
  }

  async getExchangeRates(date: Date = new Date()): Promise<ICurrencyRateDto | null> {
    if (!this.token) {
      throw new Error(`Token hasn't been set`);
    }

    // here date.toISOString() is similar to UTC+0, so timestamp will be to day start
    const url = this.url
        .replace('DATE_VAR', date.toISOString().split('T')[0])
        .replace('TOKEN_VAR', this.token);

    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText)
        }

        return response.json() as Promise<IOpenexchangeratesDto>;
      })
      .then(this.parseResponse);
  }

  private parseResponse(data: IOpenexchangeratesDto): ICurrencyRateDto {
    const {timestamp: responseTimestamp, base, rates} = data;
    const timestamp = parseToTimestamp(responseTimestamp * 1000);

    return {
      _id: timestamp.toString(),
      timestamp,
      base,
      rates,
    };
  }

}
