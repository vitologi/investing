// import {Container} from "inversify";
import {when} from "mobx";
import {CurrenciesStore, ENABLED_CURRENCIES, OPEN_EXCHANGE_RATES_API_TOKEN, RATE_PROVIDER} from "../currencies.store";
import {CurrenciesService} from "../../shared/services/currencies.service";
import {CurrencyRatesService} from "../../shared/services/currency-rates.service";
import {IntlStore} from "../../../intl/store/intl.store";
import {StorageService} from "../../../../shared/services/storage.service";
import {EmptyCurrencyRatesProvider} from "../../shared/services/empty-currency-rates.provider";
import {LanguageCode} from "../../../intl/shared/enums/language-code";
import {ICurrencyDto} from "../../shared/dtos/currency.dto";
import {Currency} from "../../shared/models/currency";
import {sleep} from "../../../../shared/utils/sleep";

// jest.mock("../../shared/services/asset-types.service");

describe('CurrenciesStore', () => {
  // let container: Container;
  let mockCurrenciesService: jest.Mocked<CurrenciesService>;
  let mockCurrencyRatesService: jest.Mocked<CurrencyRatesService>;
  let mockIntlStore: jest.Mocked<IntlStore>;
  let mockStorageService: jest.Mocked<StorageService>;
  let store: CurrenciesStore;
  const defaultDto: ICurrencyDto = {
    _id: 'code',  // code is id
    name: 'name',
    symbol_native: 'symbol_native',
    symbol: 'symbol',
    code: 'code',
    name_plural: 'name_plural',
    rounding: 0,
    decimal_digits: 0,
  };

  beforeEach(() => {
    // container = new Container();

    mockCurrenciesService = {
      currencyList: Promise.resolve({
        currencyList: {},
        get: jest.fn(),
        getAll: jest.fn(),
      }),
      list: jest.fn(async ()=>{
        await sleep(100);
        return [defaultDto];
      }),
      create: jest.fn().mockRejectedValue('Error'),
      delete: jest.fn().mockRejectedValue('Error'),
      get : jest.fn().mockRejectedValue('Error'),
      update: jest.fn().mockRejectedValue('Error'),
    };

    mockCurrencyRatesService = {
      getDeferredResult: jest.fn(),
      getExchangeRate: jest.fn(),
      notifyDeferrerRequests: jest.fn(),
      provider: new EmptyCurrencyRatesProvider(),
      setProvider: jest.fn(),
    } as unknown as jest.Mocked<CurrencyRatesService>;

    mockIntlStore = {
      locale: LanguageCode.En,
    } as jest.Mocked<IntlStore>;

    mockStorageService = {
      get: jest.fn((key)=>{
        switch (key){
          case ENABLED_CURRENCIES:
            return [];
          case RATE_PROVIDER:
            return 'provider';
          case OPEN_EXCHANGE_RATES_API_TOKEN:
            return 'token';
        }
      }),
      set: jest.fn(),
    } as unknown as jest.Mocked<StorageService>;

    store = new CurrenciesStore(
      mockCurrenciesService,
      mockCurrencyRatesService,
      mockIntlStore,
      mockStorageService,
    );
  });

  // TODO: remove container, use mocked service directly through constructor
  // beforeEach(() => {
  //   mockStorageService.get.mockImplementation();
  //
  //
  // });

  test('init (should use lazy initialization)', async () => {
    // automatically
    expect(store.isInit).toBeFalsy();
    await when(() => store.isInit);
    expect(store.isInit).toBeTruthy();

    // manual
    store.isInit = false;
    expect(store.isInit).toBeFalsy();
    store.init();
    expect(store.isInit).toBeTruthy();
  });



  test('createEmpty (should throw error)', () => {
    expect(()=> store.createEmpty()).toThrowError();
  });

  test('createFromDto', () => {
    const model = store.createFromDto(defaultDto);
    expect(model).toBeInstanceOf(Currency);
    expect(model.asDto).toEqual(defaultDto);
  });

  test('load (should load values)', async () => {
    expect(store.isInit).toBeFalsy();
    expect(store.list.length).toBe(0);
    await when(() => store.isInit);
    expect(mockCurrenciesService.list).toHaveBeenCalledTimes(1);
    expect(store.list.length).toBe(1);
  });

})
