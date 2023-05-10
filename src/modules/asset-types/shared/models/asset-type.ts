import {Model} from "../../../../shared/models/model";
import {IAssetTypeDto} from "../dtos/asset-type.dto";
import {IDomainStore} from "../../../../shared/interfaces/domain-store";

export class AssetType extends Model<IAssetTypeDto, IDomainStore<IAssetTypeDto, AssetType>>{
  name = '';
  isSystem = false;
  get asDto(): IAssetTypeDto {
    return {
      _id: this.id,
      name: this.name,
      isSystem: this.isSystem,
    };
  }
  dispose(): void {
  }

  updateFromDto(dto: IAssetTypeDto): void {
    this.name = dto.name;
    this.isSystem = dto.isSystem;
  }

  async delete(): Promise<void> {
    if(this.isSystem){
      return;
    }

    return super.delete();
  }
}
