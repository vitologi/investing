import {IBaseEventDto} from "../dtos/base-event.dto";
import {IBaseEvent} from "./base-event";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TEventFactory<T = any> = (dto: IBaseEventDto<T>) => IBaseEvent<T>;
