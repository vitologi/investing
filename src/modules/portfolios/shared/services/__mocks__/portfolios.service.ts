import {sleep} from "../../../../../shared/utils/sleep";
import {IPortfolioDto} from "../../dtos/portfolio.dto";
import {injectable} from "inversify";
import {mockedPortfolioDtos} from "../../dtos/__mocks__/portfolio.dto";

// TODO: replace returned values by mocks dto
@injectable()
export class PortfoliosService {
  static key = Symbol.for('PortfoliosService');
  list = jest.fn(async ()=>{
    await sleep(10);
    return mockedPortfolioDtos;
  });
  create = jest.fn(async (dto) => dto);
  delete = jest.fn(async (_) => void 0);
  get = jest.fn(async (_):Promise<IPortfolioDto> => mockedPortfolioDtos[0]);
  update = jest.fn(async (dto) => dto);
}
