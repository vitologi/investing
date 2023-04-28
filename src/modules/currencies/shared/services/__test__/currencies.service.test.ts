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
    expect(currencies.length).toBe(119);
  });

  test('other methods (cant use any other method except list)', async ()=>{
    // expect(await service.create(testCurrency)).to(new Error(`CurrenciesService haven't method create implementation`));
    // expect(await service.delete('id')).toThrowError();
    // expect(await service.get('id')).toThrowError();
    // expect(await service.update(testCurrency)).toThrowError();
    console.log(testCurrency);
  });
})
