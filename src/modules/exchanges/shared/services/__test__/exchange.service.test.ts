import {ExchangeService} from "../exchange.service";
import enExchs from '../../mocks/exchanges.en.mocks.json';
import ruExchs from '../../mocks/exchanges.ru.mocks.json';
import {LanguageCode} from "../../../../intl/shared/enums/language-code";
import {IExchangeDto} from "../../dtos/exchange.dto";
import {enExch} from "../../dtos/__mocks__/exchange.dto";


describe('ExchangeService', ()=>{
  let service: ExchangeService;

  beforeAll(()=>{
    service = new ExchangeService();
  });

  test('list (should return exchanges according to localization key)', async ()=>{
    const filter = (items: IExchangeDto[])=> items.filter((item)=>item._id !== '');
    await expect(service.list()).resolves.toEqual(filter(enExchs));
    await expect(service.list(LanguageCode.Ru)).resolves.toEqual(filter(ruExchs));
  });

  test('all others methods (should be blocked to use)', async ()=>{
    await expect(service.create(enExch)).rejects.toThrowError();
    await expect(service.delete('id')).rejects.toThrowError();
    await expect(service.get('id')).rejects.toThrowError();
    await expect(service.update(enExch)).rejects.toThrowError();
  });

});
