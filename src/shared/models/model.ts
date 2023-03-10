import ObjectId from 'bson-objectid';
import { makeObservable } from 'mobx';

import {IModel} from '../interfaces/model';
import {DomainStore} from './domain-store';
import {IModelDto} from "../dtos/model.dto";

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export abstract class Model<TDto extends IModelDto, TStore extends DomainStore<any, any>> implements IModel<TDto> {
  abstract get asDto(): TDto;

  abstract dispose(): void;

  protected abstract initialize(): void;

  constructor(
    protected store: TStore,
    public id: string = new ObjectId().toHexString(),
  ) {
    makeObservable(this, {});
    this.initialize();
  }

  abstract updateFromDto(dto: TDto): void;

  async delete(): Promise<void> {
    return this.store.delete(this.asDto);
  }
}
