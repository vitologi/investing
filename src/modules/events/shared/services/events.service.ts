import {IBaseEventDto} from "../dtos/base-event.dto";
import {eventsCollection} from "../../offline/events.db";
import {BaseApiService} from "../../../../shared/interfaces/base-api.service";
import {ICollection} from "@vitologi/local-db";
import {injectable} from "inversify";

@injectable()
export class EventsService extends BaseApiService<IBaseEventDto> {
  static key = Symbol('EventsService');
  private _collection: ICollection<IBaseEventDto>;

  constructor() {
    super();
    this._collection = eventsCollection();
  }

  async list(): Promise<IBaseEventDto[]> {
    return this._collection.find({});
  }

  async create(dto: IBaseEventDto): Promise<IBaseEventDto> {
    await this._collection.insertOne(dto);

    return dto;
  }

  async delete(id: string): Promise<void | IBaseEventDto> {
    await this._collection.deleteOne({_id: id});
    return;
  }

  async get(id: string): Promise<IBaseEventDto | null> {
    return this._collection.findOne({_id: id});
  }

  async update(dto: IBaseEventDto): Promise<IBaseEventDto | null> {
    const filter = {_id: dto._id};
    const result = await this._collection.updateOne(filter, {$set: dto}, {});

    return result.upsertedCount ? dto : null;
  }
}
