import defaultValues from '../portfolios.mocks.json';
import {portfoliosMigrations} from "../portfolios.migrations";
import {ICollection, IDb} from "@vitologi/local-db";
import {IPortfolioDto} from "../../shared/dtos/portfolio.dto";

describe("asset-types.migrations", ()=>{
  let mockCollection: jest.Mocked<ICollection<IPortfolioDto>>;
  let mockDb: jest.Mocked<IDb>;

  beforeAll(async ()=>{
    mockCollection = {
      insertOne: jest.fn().mockResolvedValue(void 0)
    } as unknown as jest.Mocked<ICollection<IPortfolioDto>>;

    mockDb = {
      createCollection: jest.fn().mockResolvedValue(void 0),
      dropCollection: jest.fn().mockResolvedValue(void 0),
      collection: jest.fn(),
    } as unknown as jest.Mocked<IDb>;
  });

  beforeEach(()=>{
    mockDb.collection.mockReturnValue(mockCollection);
  })

  test('check initial migration up', async ()=>{
    const first  = portfoliosMigrations[0];
    await first.up(mockDb);

    expect(mockDb.collection).toHaveBeenCalledWith("portfolios");
    expect(mockDb.createCollection).toHaveBeenCalledTimes(1);
    expect(mockDb.collection).toHaveBeenCalledTimes(1);
    expect(mockCollection.insertOne).toHaveBeenCalledTimes(defaultValues.length);
  });

  test('check initial migration down', async ()=>{
    const first  = portfoliosMigrations[0];
    await first.down(mockDb);
    expect(mockDb.dropCollection).toHaveBeenCalledTimes(1);
  });

});
