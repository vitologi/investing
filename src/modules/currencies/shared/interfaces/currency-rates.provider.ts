import {ICurrencyRateDto} from "../dtos/currency-rate.dto";

export interface ICurrencyRatesProvider {
  getExchangeRates(date?: Date): Promise<ICurrencyRateDto | null>;

  setSecureToken(value: string): void;
}
