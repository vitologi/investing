import {CurrenciesService} from "../currencies.service";
import {ICurrencyDto} from "../../dtos/currency.dto";


describe('CurrenciesService', ()=>{
  let service: CurrenciesService;
  const testCurrency: ICurrencyDto = {
    _id: '_id',
    name: 'name',
    code: 'code',
    decimal_digits: 0,
    name_plural: 'name_plural',
    rounding: 0,
    symbol: 'symbol',
    symbol_native: 'symbol_native',
  }

  beforeAll(async ()=>{
    service = new CurrenciesService();
  });

  test('created', ()=>{
    expect(service).toBeTruthy();
  });

  test('list (get currencies with default LanguageCode)', async ()=>{
    const currencies = await service.list();
    expect(currencies.length >= 119).toBeTruthy();
  });

  test('other methods (cant use any other method except list)', async ()=>{
    await expect(service.create(testCurrency)).rejects.toThrowError(`CurrenciesService haven't method create implementation`);
    await expect(service.delete('id')).rejects.toThrowError(`CurrenciesService haven't method delete implementation`);
    await expect(service.get('id')).rejects.toThrowError(`CurrenciesService haven't method get implementation`);
    await expect(service.update(testCurrency)).rejects.toThrowError(`CurrenciesService haven't method update implementation`);
  });
})
