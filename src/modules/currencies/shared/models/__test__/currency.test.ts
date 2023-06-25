import {Currency} from "../currency";
import {CurrenciesStore} from "../../../store/currencies.store";
import {usdDto} from "../../dtos/__mocks__/currency.dto";

describe('Currency', () => {
  let store: jest.Mocked<CurrenciesStore>;

  beforeAll(() => {
    store = {
      delete: jest.fn(),
    } as unknown as jest.Mocked<CurrenciesStore>;
  });

  test('should have default values', () => {
    const model = new Currency(store, 'id');
    expect(model.asDto).toEqual({
      "_id": "id",
      "code": "USD",
      "decimal_digits": 2,
      "name": "US Dollar",
      "name_plural": "US dollars",
      "rounding": 0,
      "symbol": "$",
      "symbol_native": "$",
    });
  });

  test('should be constructed from dto', () => {
    const model = new Currency(store, usdDto._id);
    model.updateFromDto(usdDto);
    expect(model.asDto).toEqual(usdDto);
  });

  test('shouldnt be deleted', async () => {
    const model = new Currency(store, 'id');
    await expect(model.delete()).rejects.toThrowError(`Currency can't be deleted`);
    expect(store.delete).toHaveBeenCalledTimes(0);
  });

  test('dispose shouldnt do anything', async () => {
    const model = new Currency(store, 'id');
    model.dispose();
    expect(store.delete).toHaveBeenCalledTimes(0);
  });
});
