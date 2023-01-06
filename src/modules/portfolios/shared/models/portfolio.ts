import {Model} from "../../../../shared/models/model";
import {IPortfolioDto} from "../interfaces/portfolio.dto";
import {PortfoliosStore} from "../../store/portfolios.store";

export class Portfolio extends Model<IPortfolioDto, PortfoliosStore>{
  name = '-';
  description = '-';
  get asDto(): IPortfolioDto {
    return {
      _id: this.id,
      name: this.name,
      description: this.description,
    };
  }
  dispose(): void {
  }

  protected initialize(): void {
  }

  updateFromDto(dto: IPortfolioDto): void {
    this.name = dto.name;
    this.description = dto.description;
  }
}
