import {IModelDto} from "../dtos/model.dto";

export interface IModel<TDto extends IModelDto> {
  asDto: TDto;
  updateFromDto(dto: TDto): void;
}
