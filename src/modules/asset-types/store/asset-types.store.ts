import {inject, injectable} from 'inversify';
import {action, makeObservable, observable} from 'mobx';
import {DomainStore} from "../../../shared/models/domain-store";
import {IAssetTypeDto} from "../shared/dtos/asset-type.dto";
import {AssetType} from "../shared/models/asset-type";
import {BaseApiService} from "../../../shared/interfaces/base-api.service";
import {AssetTypesService} from "../shared/services/asset-types.service";

@injectable()
export class AssetTypesStore extends DomainStore<IAssetTypeDto, AssetType> {
  static key = Symbol('AssetTypesStore');
  isInit = false;

  constructor(@inject(AssetTypesService.key) assetTypesService: BaseApiService<IAssetTypeDto>) {
    super(assetTypesService);
    makeObservable(this, {
      isInit: observable,
      init: action,
    });

    this.load().then(() => this.init());
  }

  init():void{
    this.isInit = true;
  }

  createEmpty(): AssetType {
    return new AssetType(this);
  }

  createFromDto(dto: IAssetTypeDto): AssetType {
    const model = new AssetType(this, dto._id);
    model.updateFromDto(dto);
    return model;
  }
}
