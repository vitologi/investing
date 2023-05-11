import {sleep} from "../../../../../shared/utils/sleep";
import {ICurrencyDto} from "../../dtos/currency.dto";

export class CurrenciesService {
  create = jest.fn(async (dto) => dto);
  get = jest.fn(async (_) => ({
    _id: '_id',
    name: 'name',
    isSystem: false
  }));
  list = jest.fn(async (): Promise<ICurrencyDto[]> => {
    await sleep(10);
    return [];
  });
  update = jest.fn(async (dto) => dto);
  delete = jest.fn(async (_) => void 0);
}
