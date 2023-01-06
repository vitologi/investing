import {IPortfolioDto} from "../interfaces/portfolio.dto";
import {portfoliosCollection} from "../../offline/portfolios.db";
import {BaseApiService} from "../../../../shared/interfaces/base-api.service";

export class PortfoliosService extends BaseApiService<IPortfolioDto>{
  async list(): Promise<IPortfolioDto[]> {
    return portfoliosCollection.find({});
  }

  async create(dto: IPortfolioDto): Promise<IPortfolioDto> {
    await portfoliosCollection.insertOne(dto);

    return dto;
  }

  async delete(id: string): Promise<void | IPortfolioDto> {
    await portfoliosCollection.deleteOne({_id: id});
    return;
  }

  async get(id: string): Promise<IPortfolioDto | null> {
    return portfoliosCollection.findOne({_id: id});
  }

  async update(dto: IPortfolioDto): Promise<IPortfolioDto| null> {
    const filter = {_id: dto._id};
    const result = await portfoliosCollection.updateOne(filter, {$set:dto}, {});

    return result.upsertedCount ? dto : null;
  }
}
