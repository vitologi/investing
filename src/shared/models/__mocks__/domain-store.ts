import {injectable} from 'inversify';
import { action, computed, observable, makeObservable } from 'mobx';
import {Model} from '../model';
import {IModelDto} from "../../dtos/model.dto";

@injectable()
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export abstract class DomainStore< TDto extends IModelDto, TDomainModel extends Model<TDto, any>> {
  isLoading = false;

  list: TDomainModel[] = [];

  get indexedList(): Map<string, TDomainModel> {
    return this.list.reduce((acc, model) => acc.set(model.id.toString(), model), new Map<string, TDomainModel>());
  }

  get item(): (id: string) => TDomainModel | undefined {
    return (id) => this.indexedList.get(id.toString());
  }

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  constructor() {
    makeObservable(this, {
      isLoading: observable,
      list: observable,
      indexedList: computed,
      item: computed,
      create: action.bound,
      save: action.bound,
      load: action.bound,
      loadOne: action.bound,
      delete: action.bound,
      unload: action.bound,
      updateFromDto: action.bound,
      clear: action.bound,
    });
  }

  abstract createFromDto(dto: TDto): TDomainModel;

  abstract createEmpty(): TDomainModel;

  create(dto: TDto): Promise<TDto> {
    this.isLoading = true;
    return this.createOnServer(dto)
      .then((response) => {
        if (response) {
          this.updateFromDto(response);
        }
        return response;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  save(dto: TDto): Promise<TDto | null> {
    this.isLoading = true;
    return this.saveOnServer(dto)
      .then((response) => {
        if (response) {
          this.updateFromDto(response);
        }
        return response;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  load(payload: any = {}): Promise<void> {
    this.isLoading = true;
    return this.loadFromServer(payload)
      .then((dtos) => {
        if (Array.isArray(dtos)) {
          dtos.forEach((dto) => this.updateFromDto(dto));
        }
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  loadOne(id: string): Promise<TDto | null> {
    this.isLoading = true;
    return this.loadOneFromServer(id)
      .then((dto) => {
        if (dto) {
          this.updateFromDto(dto);
        }

        return dto;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  // delete = jest.fn(async (dto) => dto);
  delete(dto: TDto): Promise<TDto | void> {
    this.isLoading = true;

    return this.deleteOnServer(dto)
      .then((response) => {
        const id = response ? response._id : dto._id;
        const model = this.item(id);

        if(model){
          this.clear(model);
        }

        return response;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  unload(): void {
    this.list.splice(0, this.list.length);
  }

  updateFromDto(dto: TDto, _id?: string): void {
    let model = this.list.find((item) => item.id === (_id || dto._id));

    if (!model) {
      model = this.createFromDto(dto);
      this.list.push(model);
      return;
    }

    model.updateFromDto(dto);
  }

  clear(model: TDomainModel): void {
    const index = this.list.indexOf(model);
    if (index !== -1) {
      this.list.splice(index, 1);
    }

    model.dispose();
  }

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  async loadFromServer(_: any = {}): Promise<TDto[]> {
    return [];
  }
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  async loadOneFromServer(_: any): Promise<TDto | null> {
    return null;
  }
  async createOnServer(dto: TDto): Promise<TDto> {
    return dto;
  }
  async saveOnServer(dto: TDto): Promise<TDto | null> {
    return dto;
  }
  async deleteOnServer(dto: TDto): Promise<void | TDto> {
    return dto;
  }
}
