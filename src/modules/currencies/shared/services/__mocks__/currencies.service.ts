import {sleep} from "../../../../../shared/utils/sleep";
import {ICurrencyDto} from "../../dtos/currency.dto";
import {mockedList} from "../../dtos/__mocks__/currency.dto";
import {injectable} from "inversify";

@injectable()
export class CurrenciesService {
  static key = Symbol.for('CurrenciesService');
  list = jest.fn(async (): Promise<ICurrencyDto[]> => {
    await sleep(10);
    return mockedList;
  });
  create = jest.fn().mockRejectedValue(new Error(`CurrenciesService haven't method create implementation`));
  delete = jest.fn().mockRejectedValue(new Error(`CurrenciesService haven't method delete implementation`));
  get = jest.fn().mockRejectedValue(new Error(`CurrenciesService haven't method get implementation`));
  update = jest.fn().mockRejectedValue(new Error(`CurrenciesService haven't method update implementation`));
}
