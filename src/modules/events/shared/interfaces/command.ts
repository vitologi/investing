import {IBaseEvent} from "./base-event";

export interface ICommand {
  execute(): Promise<void>;
  undo(): Promise<void>;
  event: IBaseEvent | null;
}
