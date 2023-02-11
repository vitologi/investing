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

  getExchangeRates(date: Date = new Date()): Promise<ICurrencyRateDto | null> {
    if (!this.token) {
      throw new Error(`Token hasn't been set`);
    }

    const url = this.url.replace(/\b(?:DATE_VAR|TOKEN_VAR)\b/gi, matched => ({
      DATE_VAR: date.toISOString().split('T')[0],
      TOKEN_VAR: this.token
    })[matched] || '');

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
