import {injectable} from "inversify";
import {BaseApiService} from "../../../../../shared/interfaces/base-api.service";
import {sleep} from "../../../../../shared/utils/sleep";
import {IBaseEventDto} from "../../dtos/base-event.dto";
import {mockDtos} from "../../dtos/__mocks__/base-event.dto";

@injectable()
export class EventsService extends BaseApiService<IBaseEventDto> {
  static key = Symbol.for('EventsService');
  create = jest.fn(async (dto) => dto);
  get = jest.fn(async (_) => mockDtos[0]);
  list = jest.fn(async () => {
    await sleep(10);
    return mockDtos;
  });
  update = jest.fn(async (dto) => dto);
  delete = jest.fn(async (_) => void 0);
}
