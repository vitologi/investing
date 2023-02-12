import {ICurrencyRatesProvider} from "../interfaces/currency-rates.provider";
import {ICurrencyRateDto} from "../dtos/currency-rate.dto";

export class EmptyCurrencyRatesProvider implements ICurrencyRatesProvider {
  setSecureToken(_: string): void {
  }

  async getExchangeRates(_: Date): Promise<ICurrencyRateDto | null> {
    return null;
  }
}
