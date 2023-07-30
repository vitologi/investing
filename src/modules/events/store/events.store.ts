import {inject, injectable} from 'inversify';
import {EventsService} from "../shared/services/events.service";
import {IBaseEvent} from "../shared/interfaces/base-event";
import {action, computed, makeObservable, observable} from "mobx";
import {ICommand} from "../shared/interfaces/command";
import {IBaseEventDto} from "../shared/dtos/base-event.dto";

@injectable()
export class EventsStore {
  isInit = false;
  changeIdentifier = Math.random();
  list: IBaseEventDto[] = [];
  selected = new Map<string, ICommand>();
  static key = Symbol.for('EventsStore');

  constructor(@inject(EventsService.key) private service: EventsService) {
    makeObservable(this, {
      changeIdentifier: observable, // TODO: need implementation of EventNotification pattern instead of this
      isInit: observable,
      selected: observable,
      list: observable,
      item: computed,
      load: action,
      select: action,
      unselectAll: action,
      create: action,
      delete: action,
    });
  }

  get item(): (id: string) => IBaseEventDto | undefined {
    return (id) => this.list.find((item) => item._id == id.toString());
  }

  load(): Promise<void> {
    return this.service
      .list()
      .then(async (dtos) => {
        this.list.length = 0;
        this.list.push(...dtos);
        this.isInit = true;
      });
  }

  async create(model: IBaseEvent): Promise<void> {
    const dto = await this.service.create(model.asDto); // TODO: handle create/save/exceptions
    const oldId = this.list.findIndex((item)=>(item._id===dto._id));
    if(oldId!==-1){
      this.list.splice(oldId,1,dto);
    }else {
      this.list.push(dto);
    }
    this.changeIdentifier = Math.random();
  }

  async delete(model: IBaseEvent): Promise<void> {
    await this.service.delete(model.id); // TODO: handle exceptions
    const oldId = this.list.findIndex((item)=>(item._id===model.id));
    if(oldId!==-1){
      this.list.splice(oldId,1);
    }
    this.changeIdentifier = Math.random();
  }

  select(id: string, command: ICommand): void {
    if (this.selected.has(id)) {
      this.selected.delete(id);
    } else {
      this.selected.set(id, command);
    }
  }
  unselectAll():void{
    this.selected.clear();
  }
}
