import {EmptyCurrencyRatesProvider} from "../empty-currency-rates.provider";

describe('EmptyCurrencyRatesProvider', () => {
  let provider: EmptyCurrencyRatesProvider;

  beforeAll(() => {
    provider = new EmptyCurrencyRatesProvider();
  })

  test('setSecureToken (should do nothing)', () => {
    expect(provider.setSecureToken('doesnt matter')).toBe(void 0);
  });

  test('getExchangeRates (should return null)', async () => {
   await expect(provider.getExchangeRates(new Date())).resolves.toBe(null);
  });


});
