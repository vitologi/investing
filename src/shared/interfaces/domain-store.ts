import {IModel} from './model';
import {IModelDto} from "../dtos/model.dto";

// TODO: let all stores use this interface instead of extending class value
export interface IDomainStore<TDto extends IModelDto, TDomainModel extends IModel<TDto>> {
  isLoading: boolean;
  list: TDomainModel[];

  get indexedList(): Map<string, TDomainModel>;

  get item(): (id: string) => TDomainModel | undefined;

  createFromDto(dto: TDto): TDomainModel;

  createEmpty(): TDomainModel;

  create(dto: TDto): Promise<TDto>;

  save(dto: TDto): Promise<TDto | null>;

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  load(payload: any): Promise<void>;

  loadOne(id: string): Promise<TDto | null>;

  delete(dto: TDto): Promise<TDto | void>;

  unload(): void;

  updateFromDto(dto: TDto, _id?: string): void;

  clear(model: TDomainModel): void;

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  loadFromServer(payload: any): Promise<TDto[]>;

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  loadOneFromServer(id: any): Promise<TDto | null>;

  createOnServer(dto: TDto): Promise<TDto>;

  saveOnServer(dto: TDto): Promise<TDto | null>;

  deleteOnServer(dto: TDto): Promise<void | TDto>;
}
