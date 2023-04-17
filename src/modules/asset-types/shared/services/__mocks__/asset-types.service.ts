import {IAssetTypeDto} from "../../interfaces/asset-type.dto";
import {BaseApiService} from "../../../../../shared/interfaces/base-api.service";
import {sleep} from "../../../../../shared/utils/sleep";
import defaultAssetTypes from "../../../offline/asset-types.mocks.json";

export class AssetTypesService extends BaseApiService<IAssetTypeDto> {

  create = jest.fn(async (dto) => dto);
  get = jest.fn(async (_) => ({
    _id: '_id',
    name: 'name',
    isSystem: false
  }));
  list = jest.fn(async () => {
    await sleep(10);
    return defaultAssetTypes;
  });
  update = jest.fn(async (dto) => dto);
  delete = jest.fn(async (_) => void 0);

  //
  // async list(): Promise<IAssetTypeDto[]> {
  //   return this._collection.find({});
  // }
  //
  // async create(dto: IAssetTypeDto): Promise<IAssetTypeDto> {
  //   await this._collection.insertOne(dto);
  //
  //   return dto;
  // }
  //
  // async delete(id: string): Promise<void | IAssetTypeDto> {
  //   await this._collection.deleteOne({_id: id});
  //   return;
  // }
  //
  // async get(id: string): Promise<IAssetTypeDto | null> {
  //   return this._collection.findOne({_id: id});
  // }
  //
  // async update(dto: IAssetTypeDto): Promise<IAssetTypeDto| null> {
  //   const filter = {_id: dto._id};
  //   const result = await this._collection.updateOne(filter, {$set:dto}, {});
  //
  //   return result.upsertedCount ? dto : null;
  // }
}
