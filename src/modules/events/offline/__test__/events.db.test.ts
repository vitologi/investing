import {DbClient, ICollection, IDb, IDbClient} from "@vitologi/local-db";
import {IBaseEventDto} from "../../shared/dtos/base-event.dto";
import {eventsCollection} from "../events.db";

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

describe("events.db", ()=>{
  let client: jest.Mocked<IDbClient>;
  let db: jest.Mocked<IDb>;

  beforeAll(async ()=>{
    client = new DbClient() as unknown as jest.Mocked<IDbClient>;
    db = client.db("events") as jest.Mocked<IDb>;
  });

  test('get collection', ()=>{
    db.collection.mockReturnValue('collection' as unknown as ICollection<IBaseEventDto<unknown>>);
    expect(eventsCollection()).toBe('collection');
  });

});
