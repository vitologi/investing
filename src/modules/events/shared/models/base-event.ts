import ObjectId from "bson-objectid";
import {EventType} from "../enums/event-type";
import {IBaseEventDto} from "../dtos/base-event.dto";
import {IBaseEvent} from "../interfaces/base-event";

export abstract class BaseEvent<T> implements IBaseEvent<T> {
  readonly id: string = new ObjectId().toHexString()
  type: EventType = EventType.Unknown;
  source: string | null = null;
  timestamp: Date = new Date();
  abstract payload: T;

  protected constructor(dto?: IBaseEventDto<T>) {
    if(!dto){
      return this;
    }

    this.id = dto._id;
    this.type = dto.type;
    this.timestamp = new Date(dto.timestamp);
    this.source = dto.source;
  }

  get asDto(): IBaseEventDto<T> {
    return {
      _id: this.id,
      source: this.source,
      type: this.type,
      timestamp: this.timestamp.getTime(),
      payload: this.payload,
    }
  }

  setPayload(value: T): void {
    this.payload = value;
  }

}
