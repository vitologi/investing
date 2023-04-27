import ObjectId from 'bson-objectid';
import {makeObservable} from 'mobx';

import {IModel} from '../interfaces/model';
import {IModelDto} from "../dtos/model.dto";
import {IDomainStore} from "../interfaces/domain-store";

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export abstract class Model<TDto extends IModelDto, TStore extends IDomainStore<any, any>> implements IModel<TDto> {
  abstract get asDto(): TDto;

  abstract dispose(): void;

  constructor(
    protected store: TStore,
    public id: string = new ObjectId().toHexString(),
  ) {
    makeObservable(this, {});
  }

  abstract updateFromDto(dto: TDto): void;

  async delete(): Promise<void> {
    return this.store.delete(this.asDto);
  }
}
