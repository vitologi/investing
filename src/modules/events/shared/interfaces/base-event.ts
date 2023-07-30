import {EventType} from "../enums/event-type";
import {IBaseEventDto} from "../dtos/base-event.dto";

export interface IBaseEvent<T = unknown> {
  id: string;
  type: EventType;
  source: string | null;
  timestamp: Date;
  payload: T;
  setPayload(value: T): void;
  asDto: IBaseEventDto<T>;
}
