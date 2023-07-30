import {EventType} from "../enums/event-type";

export interface IBaseEventDto<T = unknown> {
  _id: string;
  type: EventType;
  source: string | null;
  payload: T;
  timestamp: number; // unixtime
}
