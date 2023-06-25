import {sleep} from "../../../../../shared/utils/sleep";
import {list} from "../../dtos/__mocks__/exchange.dto";
import {IExchangeDto} from "../../dtos/exchange.dto";

export class ExchangeService {
  list = jest.fn(async () => {
    await sleep(20);
    return list;
  });

  async create(_: IExchangeDto): Promise<IExchangeDto> {
    throw new Error(`${this.constructor.name} haven't method create implementation`);
  }

  async delete(_: string): Promise<void | IExchangeDto> {
    throw new Error(`${this.constructor.name} haven't method delete implementation`);
  }

  async get(_: string): Promise<IExchangeDto | null> {
    throw new Error(`${this.constructor.name} haven't method get implementation`);
  }

  async update(_: IExchangeDto): Promise<IExchangeDto | null> {
    throw new Error(`${this.constructor.name} haven't method update implementation`);
  }
}
