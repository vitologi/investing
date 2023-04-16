import {inject, injectable} from 'inversify';
import {action, makeObservable, observable} from 'mobx';
import {DomainStore} from "../../../shared/models/domain-store";
import {IAssetTypeDto} from "../shared/interfaces/asset-type.dto";
import {AssetType} from "../shared/models/asset-type";
import {BaseApiService} from "../../../shared/interfaces/base-api.service";

@injectable()
export class AssetTypesStore extends DomainStore<IAssetTypeDto, AssetType> {
  isInit = false;

  constructor(@inject('AssetTypesService') assetTypesService: BaseApiService<IAssetTypeDto>) {
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
