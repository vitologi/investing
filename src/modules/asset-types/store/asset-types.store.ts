import {inject, injectable} from 'inversify';
import {makeObservable} from 'mobx';
import {DomainStore} from "../../../shared/models/domain-store";
import {IAssetTypeDto} from "../shared/interfaces/asset-type.dto";
import {AssetType} from "../shared/models/asset-type";
import {AssetTypesService} from "../shared/services/asset-types.service";

@injectable()
export class AssetTypesStore  extends  DomainStore<IAssetTypeDto, AssetType>{
  constructor(@inject('AssetTypesService') assetTypesService: AssetTypesService) {
    super(assetTypesService);
    makeObservable(this, {});
  }

  createEmpty(): AssetType {
    return new AssetType(this);
  }

  createFromDto(dto: IAssetTypeDto): AssetType {
    const model = new AssetType(this, dto._id);
    model.updateFromDto(dto);
    return model;
  }

  protected initialize(): void {
    this.load();
  }

}
