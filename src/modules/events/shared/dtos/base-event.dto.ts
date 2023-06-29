import {EventType} from "../enums/event-type";

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export interface IBaseEventDto<T = unknown> {
  _id: string;
  type: EventType;
  source: string | null;
  payload: T;
  timestamp: number; // unixtime
}
