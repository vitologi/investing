import {Model} from "../../../../shared/models/model";
import {IAssetTypeDto} from "../interfaces/asset-type.dto";
import {AssetTypesStore} from "../../store/asset-types.store";

export class AssetType extends Model<IAssetTypeDto, AssetTypesStore>{
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
