import {DbClient, ICollection, IDb, IDbClient} from "@vitologi/local-db";
import {currencyRatesCollection} from "../currencies.db";
import {ICurrencyRateDto} from "../../shared/dtos/currency-rate.dto";

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

describe("currencies.db", ()=>{
  let client: jest.Mocked<IDbClient>;
  let db: jest.Mocked<IDb>;

  beforeAll(async ()=>{
    client = new DbClient() as unknown as jest.Mocked<IDbClient>;
    db = client.db("currencies") as jest.Mocked<IDb>;
  });

  test('get collection', ()=>{
    db.collection.mockReturnValue('collection' as unknown as ICollection<ICurrencyRateDto>);
    expect(currencyRatesCollection()).toBe('collection');
  });
});
