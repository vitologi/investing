export class CurrencyRatesService {

  provider = {
    getExchangeRates: jest.fn(),
    setSecureToken: jest.fn(),
  };

  setProvider = jest.fn();

  getExchangeRate = jest.fn().mockResolvedValue(1);
}
