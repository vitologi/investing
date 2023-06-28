import {IAssetTypeDto} from "../../dtos/asset-type.dto";
import {BaseApiService} from "../../../../../shared/interfaces/base-api.service";
import {sleep} from "../../../../../shared/utils/sleep";
import defaultAssetTypes from "../../../offline/asset-types.mocks.json";
import {injectable} from "inversify";

@injectable()
export class AssetTypesService extends BaseApiService<IAssetTypeDto> {
  static key = Symbol('AssetTypesService');
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
}
