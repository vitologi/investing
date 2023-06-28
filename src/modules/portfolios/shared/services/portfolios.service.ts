import {IPortfolioDto} from "../dtos/portfolio.dto";
import {portfoliosCollection} from "../../offline/portfolios.db";
import {BaseApiService} from "../../../../shared/interfaces/base-api.service";
import {injectable} from "inversify";
import {ICollection} from "@vitologi/local-db";

@injectable()
export class PortfoliosService extends BaseApiService<IPortfolioDto>{
  static key = Symbol('PortfoliosService');
  private _collection: ICollection<IPortfolioDto>;

  constructor() {
    super();
    this._collection = portfoliosCollection();
  }

  async list(): Promise<IPortfolioDto[]> {
    return this._collection.find({});
  }

  async create(dto: IPortfolioDto): Promise<IPortfolioDto> {
    await this._collection.insertOne(dto);

    return dto;
  }

  async delete(id: string): Promise<void | IPortfolioDto> {
    await this._collection.deleteOne({_id: id});
    return;
  }

  async get(id: string): Promise<IPortfolioDto | null> {
    return this._collection.findOne({_id: id});
  }

  async update(dto: IPortfolioDto): Promise<IPortfolioDto| null> {
    const filter = {_id: dto._id};
    const result = await this._collection.updateOne(filter, {$set:dto}, {});

    return result.upsertedCount ? dto : null;
  }
}
