import {EventType} from "../enums/event-type";

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export interface IBaseEventDto<T = any> {
  _id: string;
  type: EventType;
  payload: T;
  timestamp: number; // unixtime
}
