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
import {CurrencyRateProvider} from "../../shared/enums/currency-rate-provider";
import {OpenexchangeratesProvider} from "../../shared/services/openexchangerates.provider";

describe('CurrenciesStore', () => {
  // let container: Container;
  let mockCurrenciesService: jest.Mocked<CurrenciesService>;
  let mockCurrencyRatesService: jest.Mocked<CurrencyRatesService>;
  let mockIntlStore: jest.Mocked<IntlStore>;
  let mockStorageService: jest.Mocked<StorageService>;
  let store: CurrenciesStore;
  const usdDto: ICurrencyDto = {
    _id: 'USD',  // code is id
    name: 'name',
    symbol_native: 'symbol_native',
    symbol: 'symbol',
    code: 'USD',
    name_plural: 'name_plural',
    rounding: 0,
    decimal_digits: 0,
  };
  const eurDto: ICurrencyDto = {
    _id: 'EUR',  // code is id
    name: 'name',
    symbol_native: 'symbol_native',
    symbol: 'symbol',
    code: 'EUR',
    name_plural: 'name_plural',
    rounding: 0,
    decimal_digits: 0,
  };

  beforeEach(() => {
    mockCurrenciesService = {
      currencyList: Promise.resolve({
        currencyList: {},
        get: jest.fn(),
        getAll: jest.fn(),
      }),
      list: jest.fn(async ()=>{
        await sleep(100);
        return [usdDto, eurDto];
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
            return CurrencyRateProvider.Empty;
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
    const model = store.createFromDto(usdDto);
    expect(model).toBeInstanceOf(Currency);
    expect(model.asDto).toEqual(usdDto);
  });

  test('load (should load values)', async () => {
    expect(store.isInit).toBeFalsy();
    expect(store.list.length).toBe(0);
    await when(() => store.isInit);
    expect(mockCurrenciesService.list).toHaveBeenCalledTimes(1);
    expect(store.list.length).toBe(2);
  });

  test('toggleEnabled (should enable/disabled currency and store it)', async () => {
    expect(mockStorageService.set).toHaveBeenCalledTimes(0);
    store.toggleEnabled('USD');
    expect(mockStorageService.set).toHaveBeenCalledTimes(1);
    expect(store.enabled.includes('USD')).toBeTruthy();
    store.toggleEnabled('USD');
    expect(store.enabled.includes('USD')).toBeFalsy();
    expect(mockStorageService.set).toHaveBeenCalledTimes(2);
  });

  test('setOpenExchangeRatesApiToken (should use OpenExchangeRatesApiToken and store it)', async () => {
    expect(mockStorageService.set).toHaveBeenCalledTimes(0);
    store.setOpenExchangeRatesApiToken('TOKEN');
    expect(mockStorageService.set).toHaveBeenCalledTimes(1);
  });

  test('setRateProvider (should use Openexchangerates provider and store it)', async () => {
    expect(mockStorageService.set).toHaveBeenCalledTimes(0);
    store.setRateProvider(CurrencyRateProvider.Openexchangerates);
    expect(mockStorageService.set).toHaveBeenCalledTimes(1);
    expect(mockStorageService.set).toHaveBeenCalledWith(RATE_PROVIDER, CurrencyRateProvider.Openexchangerates);
    expect(mockCurrencyRatesService.setProvider.mock.calls[1][0]).toBeInstanceOf(OpenexchangeratesProvider);
  });

  test('setRateProvider (should throw error if provider doesnt exist)', async () => {
    expect(() => store.setRateProvider('UNKNOWN' as CurrencyRateProvider)).toThrowError(`Type of provider doesn't exist`);
  });

  test('baseCurrency (should use USD)', async () => {
    await when(() => store.isInit);
    const baseCurrency = store.baseCurrency;
    expect(baseCurrency?.code).toBe('USD');
  });

  test('baseCurrency (should return null if there is no such currency)', async () => {
    await when(() => store.isInit);
    const baseCurrency = store.baseCurrency;
    expect(baseCurrency?.code).toBe('USD');
    store.setBaseCurrency('UNDEFINED');
    expect(store.baseCurrency).toBeNull();
  });

  test('setBaseCurrency (should change base currency)', async () => {
    await when(() => store.isInit);
    const baseCurrency = store.baseCurrency;
    expect(baseCurrency?.code).toBe('USD');
    store.setBaseCurrency('EUR');
    expect(store.baseCurrency?.code).toBe('EUR');
  });

  test('enabledList (should show only enabled currencies)', async () => {
    await when(() => store.isInit);
    expect(store.enabledList.length).toBe(0);
    store.toggleEnabled('USD');
    store.toggleEnabled('EUR');
    expect(store.enabledList.length).toBe(2);
  });

  test('isEnabled (should use shortcut for enabled currency)', async () => {
    expect(store.isEnabled('USD')).toBeFalsy();
    store.toggleEnabled('USD')
    expect(store.isEnabled('USD')).toBeTruthy();
  });

  test('setStoredExchangeRate (should save exchange rates)', async () => {
    expect(store.storedExchangeRates.has('USD')).toBeFalsy();
    store.setStoredExchangeRate('USD', 1);
    expect(store.storedExchangeRates.has('USD')).toBeTruthy();
    expect(store.storedExchangeRates.get('USD')).toBe(1);
  });

  test('removeStoredExchangeRate (should remove exchange rates)', async () => {
    store.setStoredExchangeRate('USD', 1);
    expect(store.storedExchangeRates.has('USD')).toBeTruthy();
    store.removeStoredExchangeRate('USD');
    expect(store.storedExchangeRates.has('USD')).toBeFalsy();
  });

  test('convert (should return the same amount if currencies are the same)', async () => {
    await when(() => store.isInit);
    expect(store.convert(100, 'USD','USD')).toBe(100);
  });


})
