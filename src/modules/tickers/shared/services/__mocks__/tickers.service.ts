import {sleep} from "../../../../../shared/utils/sleep";
import {ITickerDto} from "../../dtos/ticker.dto";
import {tickerDto} from "../../dtos/__mocks__/ticker.dto";
import {injectable} from "inversify";

@injectable()
export class TickersService {
  static key = Symbol('TickersService');
  list = jest.fn(async ()=>{
    await sleep(10);
    return [];
  });
  create = jest.fn(async (dto) => dto);
  delete = jest.fn(async (_) => void 0);
  get = jest.fn(async (_):Promise<ITickerDto> => (tickerDto));
  update = jest.fn(async (dto) => dto);
}
