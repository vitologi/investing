import {DbClient, ICollection, IDb, IDbClient} from "@vitologi/local-db";
import {portfoliosCollection} from "../portfolios.db";
import {IPortfolioDto} from "../../shared/dtos/portfolio.dto";

jest.mock("@vitologi/local-db", ()=>{
  const mockDb = {
    open: jest.fn(),
    collection: jest.fn(),
  };
  const mockClient = {db: jest.fn(()=>mockDb)};
  const mockDbClientConstructor = jest.fn(()=>mockClient);
  return {
    __esModule:true,
    DbClient: mockDbClientConstructor,
  }
});

describe("asset-type.db", ()=>{
  let client: jest.Mocked<IDbClient>;
  let db: jest.Mocked<IDb>;

  beforeAll(async ()=>{
    client = new DbClient() as unknown as jest.Mocked<IDbClient>;
    db = client.db("portfolios") as jest.Mocked<IDb>;
  });

  test('get collection', ()=>{
    db.collection.mockReturnValue('collection' as unknown as ICollection<IPortfolioDto>);
    expect(portfoliosCollection()).toBe('collection');
  });

});
