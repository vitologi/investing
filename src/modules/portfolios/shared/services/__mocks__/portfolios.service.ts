import {sleep} from "../../../../../shared/utils/sleep";
import {IPortfolioDto} from "../../dtos/portfolio.dto";
import {injectable} from "inversify";

// TODO: replace returned values by mocks dto
@injectable()
export class PortfoliosService {
  list = jest.fn(async ()=>{
    await sleep(10);
    return [];
  });
  create = jest.fn(async (dto) => dto);
  delete = jest.fn(async (_) => void 0);
  get = jest.fn(async (_):Promise<IPortfolioDto> => ({
    _id: '_id',
    name: 'name',
    description: 'description'
  }));
  update = jest.fn(async (dto) => dto);
}
