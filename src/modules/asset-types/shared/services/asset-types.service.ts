import {IAssetTypeDto} from "../interfaces/asset-type.dto";
import {assetTypesCollection} from "../../offline/asset-type.db";
import {BaseApiService} from "../../../../shared/interfaces/base-api.service";

export class AssetTypesService extends BaseApiService<IAssetTypeDto>{
  list(): Promise<IAssetTypeDto[]> {
    return assetTypesCollection.find({});
  }

  async create(dto: IAssetTypeDto): Promise<IAssetTypeDto> {
    await assetTypesCollection.insertOne(dto);

    return dto;
  }

  async delete(id: string): Promise<void | IAssetTypeDto> {
    await assetTypesCollection.deleteOne({_id: id});
    return;
  }

  async get(id: string): Promise<IAssetTypeDto | null> {
    return assetTypesCollection.findOne({_id: id});
  }

  async update(dto: IAssetTypeDto): Promise<IAssetTypeDto| null> {
    const filter = {_id: dto._id};
    const result = await assetTypesCollection.updateOne(filter, {$set:dto}, {});

    return result.upsertedCount ? dto : null;
  }
}
