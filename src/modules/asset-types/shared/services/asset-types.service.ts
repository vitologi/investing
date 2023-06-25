import {IAssetTypeDto} from "../dtos/asset-type.dto";
import {assetTypesCollection} from "../../offline/asset-type.db";
import {BaseApiService} from "../../../../shared/interfaces/base-api.service";
import {ICollection} from "@vitologi/local-db";

export class AssetTypesService extends BaseApiService<IAssetTypeDto>{
  private _collection: ICollection<IAssetTypeDto>;
  constructor() {
    super();
    this._collection = assetTypesCollection();
  }

  async list(): Promise<IAssetTypeDto[]> {
    return this._collection.find({});
  }

  async create(dto: IAssetTypeDto): Promise<IAssetTypeDto> {
    await this._collection.insertOne(dto);

    return dto;
  }

  async delete(id: string): Promise<void | IAssetTypeDto> {
    await this._collection.deleteOne({_id: id});
    return;
  }

  async get(id: string): Promise<IAssetTypeDto | null> {
    return this._collection.findOne({_id: id});
  }

  async update(dto: IAssetTypeDto): Promise<IAssetTypeDto| null> {
    const filter = {_id: dto._id};
    const result = await this._collection.updateOne(filter, {$set:dto}, {});

    return result.upsertedCount ? dto : null;
  }
}
