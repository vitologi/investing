import {ICollection} from "@vitologi/local-db";
import {PortfoliosService} from "../portfolios.service";
import {portfoliosCollection} from "../../../offline/portfolios.db";
import {IPortfolioDto} from "../../dtos/portfolio.dto";
import {mockedPortfolioDtos} from "../../dtos/__mocks__/portfolio.dto";

jest.mock("../../../offline/portfolios.db", ()=>{
  const mockCollection = {
    find: jest.fn(),
    findOne: jest.fn(),
    deleteOne: jest.fn(),
    insertOne: jest.fn(),
    updateOne: jest.fn(),
  };

  return ({
    __esModule: true,
    portfoliosCollection: jest.fn(()=>mockCollection)
  })
});

describe('PortfoliosService', ()=>{
  let service: PortfoliosService;
  let mockCollection: jest.Mocked<ICollection<IPortfolioDto>>;

  beforeAll(async ()=>{
    service = new PortfoliosService();
    mockCollection = portfoliosCollection() as unknown as jest.Mocked<ICollection<IPortfolioDto>>;
  });

  test('created', ()=>{
    expect(service).toBeTruthy();
  });

  test('list (should call find method)', async ()=>{
    await service.list();
    expect(mockCollection.find).toHaveBeenCalledTimes(1);
  });

  test('create (should call insertOne method)', async ()=>{
    await service.create(mockedPortfolioDtos[0]);
    expect(mockCollection.insertOne).toHaveBeenCalledTimes(1);
  });

  test('delete (should call deleteOne method)', async ()=>{
    await service.delete('id');
    expect(mockCollection.deleteOne).toHaveBeenCalledTimes(1);
  });

  test('get (should call findOne method)', async ()=>{
    await service.get('id');
    expect(mockCollection.findOne).toHaveBeenCalledTimes(1);
  });

  test('update (should call updateOne method)', async ()=>{
    mockCollection.updateOne
      .mockResolvedValueOnce({upsertedCount: 1, upsertedIds:["_id"], matchedCount:1 })
      .mockResolvedValueOnce({upsertedCount: 0, upsertedIds:[], matchedCount:0 });

    expect(await service.update(mockedPortfolioDtos[0])).toEqual(mockedPortfolioDtos[0]);
    expect(await service.update(mockedPortfolioDtos[0])).toEqual(null);
    expect(mockCollection.updateOne).toHaveBeenCalledTimes(2);
  });
})
