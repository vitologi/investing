import {ITickerDto} from "../dtos/ticker.dto";
import {BaseApiService} from "../../../../shared/interfaces/base-api.service";
import {injectable} from "inversify";

@injectable()
export class TickersService extends BaseApiService<ITickerDto>{
  static key = Symbol('TickersService');
  async list(): Promise<ITickerDto[]> {
    return [];
  }

  async create(dto: ITickerDto): Promise<ITickerDto> {
    return dto;
  }

  async delete(_: string): Promise<void | ITickerDto> {
    return;
  }

  async get(_: string): Promise<ITickerDto | null> {
    return null;
  }

  async update(dto: ITickerDto): Promise<ITickerDto| null> {
    // TODO: use this after db library will be fixed
    // const filter = {_id: dto._id};
    // const result = await transactionsCollection.updateOne(filter, {$set:dto}, {});
    //
    // return result.upsertedCount ? dto : null;

    await this.delete(dto._id);
    return this.create(dto);
  }
}
