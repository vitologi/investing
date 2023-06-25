import {CurrenciesStore, RATE_PROVIDER} from "../currencies.store";
import {CurrenciesService} from "../../shared/services/currencies.service";
import {CurrencyRatesService} from "../../shared/services/currency-rates.service";
import {IntlStore} from "../../../intl/store/intl.store";
import {StorageService} from "../../../../shared/services/storage.service";
import {Currency} from "../../shared/models/currency";
import {Container} from "inversify";
import {buildIoc} from "../../../../store/build-ioc";
import {mockedList, usdDto} from "../../shared/dtos/__mocks__/currency.dto";
import {CurrencyRateProvider} from "../../shared/enums/currency-rate-provider";
import {OpenexchangeratesProvider} from "../../shared/services/openexchangerates.provider";
import {when} from "mobx";
import {sleep} from "../../../../shared/utils/sleep";
import {parseToTimestamp} from "../../shared/utils/parse-to-timestamp";

jest.mock("../../shared/services/currencies.service");
jest.mock("../../shared/services/currency-rates.service");
jest.mock("../../../../shared/services/storage.service");
describe('CurrenciesStore', () => {
  let di: Container;

  beforeAll(()=>{
    di = buildIoc([CurrenciesService, CurrencyRatesService, IntlStore, StorageService, CurrenciesStore]);
  });

  beforeEach(async ()=>{
    di.snapshot();
    const store = di.get<CurrenciesStore>(CurrenciesStore.name);
    await when(()=>store.isInit);
  });

  afterEach(()=>{
    di.restore();
  });

  test('init (should use lazy initialization)', async () => {
    const store = di.get<CurrenciesStore>(CurrenciesStore.name);
    store.isInit = false;
    expect(store.isInit).toBeFalsy();
    store.init();
    expect(store.isInit).toBeTruthy();
  });

  test('createEmpty (should throw error)', () => {
    const store = di.get<CurrenciesStore>(CurrenciesStore.name);
    expect(()=> store.createEmpty()).toThrowError();
  });

  test('createFromDto', () => {
    const store = di.get<CurrenciesStore>(CurrenciesStore.name);
    const model = store.createFromDto(usdDto);
    expect(model).toBeInstanceOf(Currency);
    expect(model.asDto).toEqual(usdDto);
  });

  test('load (should load values)', async () => {
    const store = di.get<CurrenciesStore>(CurrenciesStore.name);
    store.isInit = false;
    store.unload();
    expect(store.isInit).toBeFalsy();
    expect(store.list.length).toBe(0);
    await store.load();
    expect(store.list.length).toBe(mockedList.length);
  });

  test('toggleEnabled (should enable/disabled currency and store it)', async () => {
    const store = di.get<CurrenciesStore>(CurrenciesStore.name);
    const service = di.get<StorageService>(StorageService.name);
    const spy = jest.spyOn(service, 'set');
    expect(spy).toHaveBeenCalledTimes(0);
    expect(store.enabled.includes('USD')).toBeTruthy();
    store.toggleEnabled('USD');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(store.enabled.includes('USD')).toBeFalsy();
  });

  test('setOpenExchangeRatesApiToken (should use OpenExchangeRatesApiToken and store it)', async () => {
    const store = di.get<CurrenciesStore>(CurrenciesStore.name);
    const service = di.get<StorageService>(StorageService.name);
    const spy = jest.spyOn(service, 'set');
    expect(spy).toHaveBeenCalledTimes(0);
    store.setOpenExchangeRatesApiToken('TOKEN');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('setRateProvider (should use Openexchangerates provider and store it)', async () => {
    const store = di.get<CurrenciesStore>(CurrenciesStore.name);
    const service = di.get<StorageService>(StorageService.name);
    const currencyRatesService = di.get<CurrencyRatesService>(CurrencyRatesService.name);
    const ratesSpy = jest.spyOn(currencyRatesService, "setProvider");
    const spy = jest.spyOn(service, 'set');
    expect(spy).toHaveBeenCalledTimes(0);
    store.setRateProvider(CurrencyRateProvider.Openexchangerates);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(RATE_PROVIDER, CurrencyRateProvider.Openexchangerates);
    expect(ratesSpy.mock.calls[1][0]).toBeInstanceOf(OpenexchangeratesProvider);
  });

  test('setRateProvider (should throw error if provider doesnt exist)', async () => {
    const store = di.get<CurrenciesStore>(CurrenciesStore.name);
    expect(() => store.setRateProvider('UNKNOWN' as CurrencyRateProvider)).toThrowError(`Type of provider doesn't exist`);
  });

  test('baseCurrency (should use USD)', async () => {
    const store = di.get<CurrenciesStore>(CurrenciesStore.name);
    const baseCurrency = store.baseCurrency;
    expect(baseCurrency?.code).toBe('USD');
  });

  test('baseCurrency (should return null if there is no such currency)', async () => {
    const store = di.get<CurrenciesStore>(CurrenciesStore.name);
    const baseCurrency = store.baseCurrency;
    expect(baseCurrency?.code).toBe('USD');
    store.setBaseCurrency('UNDEFINED');
    expect(store.baseCurrency).toBeNull();
  });

  test('setBaseCurrency (should change base currency)', async () => {
    const store = di.get<CurrenciesStore>(CurrenciesStore.name);
    const baseCurrency = store.baseCurrency;
    expect(baseCurrency?.code).toBe('USD');
    store.setBaseCurrency('EUR');
    expect(store.baseCurrency?.code).toBe('EUR');
  });

  test('enabledList (should show only enabled currencies)', async () => {
    const store = di.get<CurrenciesStore>(CurrenciesStore.name);
    expect(store.enabledList.length).toBe(2);
    store.toggleEnabled('USD');
    store.toggleEnabled('EUR');
    expect(store.enabledList.length).toBe(0);
  });

  test('isEnabled (should use shortcut for enabled currency)', async () => {
    const store = di.get<CurrenciesStore>(CurrenciesStore.name);
    expect(store.isEnabled('USD')).toBeTruthy();
    store.toggleEnabled('USD')
    expect(store.isEnabled('USD')).toBeFalsy();
  });

  test('setStoredExchangeRate (should save exchange rates)', async () => {
    const store = di.get<CurrenciesStore>(CurrenciesStore.name);
    expect(store.storedExchangeRates.has('USD')).toBeFalsy();
    store.setStoredExchangeRate('USD', 1);
    expect(store.storedExchangeRates.has('USD')).toBeTruthy();
    expect(store.storedExchangeRates.get('USD')).toBe(1);
  });

  test('removeStoredExchangeRate (should remove exchange rates)', async () => {
    const store = di.get<CurrenciesStore>(CurrenciesStore.name);
    store.setStoredExchangeRate('USD', 1);
    expect(store.storedExchangeRates.has('USD')).toBeTruthy();
    store.removeStoredExchangeRate('USD');
    expect(store.storedExchangeRates.has('USD')).toBeFalsy();
  });

  test('convert (should return the same amount if currencies are the same)', async () => {
    const store = di.get<CurrenciesStore>(CurrenciesStore.name);
    expect(store.convert(100, 'USD','USD')).toBe(100);
  });

  test('convert (should return adjusted amount if rate already exists)', async () => {
    const store = di.get<CurrenciesStore>(CurrenciesStore.name);
    const from = 'USD';
    const to = 'EUR';
    const timestamp = 1682884800000;
    const rateId = [from,to,parseToTimestamp(timestamp)].join('.');
    store.setStoredExchangeRate(rateId, 2);
    expect(store.convert(100, from,to, timestamp)).toBe(200);
  });

  test('convert (should request and save rates if there is no stored rate yet)', async () => {
    const store = di.get<CurrenciesStore>(CurrenciesStore.name);
    const service = di.get<CurrencyRatesService>(CurrencyRatesService.name);
    const spy = jest.spyOn(store, 'setStoredExchangeRate');
    const currencyRatesSpy = jest.spyOn(service, 'getExchangeRate').mockResolvedValue(2);

    const from = 'USD';
    const to = 'EUR';
    const timestamp = 1682884800000;
    const rateId = [from,to,parseToTimestamp(timestamp)].join('.');

    expect(store.convert(100, from,to, timestamp)).toBe(100);
    expect(currencyRatesSpy).toHaveBeenCalledTimes(1);
    expect(currencyRatesSpy).toHaveBeenCalledWith({from, to, date: new Date(timestamp)});
    await sleep(10);
    expect(spy).toHaveBeenCalledWith(rateId, 2);
  });

  test('sortedByEnablingList (should put enabled currencies at the top of list)', async () => {
    const store = di.get<CurrenciesStore>(CurrenciesStore.name);

    // disable all currencies
    for(let i = store.enabled.length-1; i >=0 ; i--){
      store.toggleEnabled(store.enabled[i]);
    }

    const list = store.list.map((item)=>item.id);
    let sortedByEnablingList = store.sortedByEnablingList.map((item)=>item.id);

    expect(list).toEqual(sortedByEnablingList);
    const lastId = list[list.length-1];
    store.toggleEnabled(lastId);
    sortedByEnablingList = store.sortedByEnablingList.map((item)=>item.id);
    expect(lastId).toEqual(sortedByEnablingList[0]);
  });

  test('symbol (should show native symbol of currency)', async () => {
    const store = di.get<CurrenciesStore>(CurrenciesStore.name);
    expect(store.symbol(null)).toBe('');
    expect(store.symbol('USD')).toBe('$');
  });
})
