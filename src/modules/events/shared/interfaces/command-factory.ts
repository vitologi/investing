import {IBaseEventDto} from "../dtos/base-event.dto";
import {ICommand} from "./command";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TCommandFactory<T = any> = (dto: IBaseEventDto<T>) => ICommand;
