import {inject, injectable} from 'inversify';
import {action, makeObservable} from "mobx";
import {ICommand} from "../shared/interfaces/command";
import {EventsStore} from "./events.store";

@injectable()
export class CommandsStore {
  static key = Symbol.for('CommandsStore');

  constructor(@inject(EventsStore.key) private eventStore: EventsStore) {
    makeObservable(this, {
      executeCommand: action,
      undoCommand: action,
    });
  }

  async executeCommand(command: ICommand): Promise<void> {
    await command.execute();
    if(command.event){
      await this.eventStore.create(command.event)
    }
  }

  async undoCommand(command: ICommand): Promise<void> {
    const event = command.event;
    await command.undo();
    if(event){
      await this.eventStore.delete(event);
    }
  }
}
