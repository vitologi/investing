import {injectable} from 'inversify';
import {IListFilter} from './list-filter';

@injectable()
export abstract class BaseApiService<TDtoModel,
  TListFilter = Partial<IListFilter>,
  TIdentifier = string> {

  abstract list(request: TListFilter, options?: unknown): Promise<TDtoModel[]>;

  abstract get(id: TIdentifier, options?: unknown): Promise<TDtoModel | null>;

  abstract create(model: TDtoModel, options?: unknown): Promise<TDtoModel>;

  abstract update(model: TDtoModel, options?: unknown): Promise<TDtoModel | null> ;

  abstract delete(id: TIdentifier, options?: unknown): Promise<void | TDtoModel>;
}
