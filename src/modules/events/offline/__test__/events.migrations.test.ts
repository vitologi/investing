import {eventsMigrations} from "../events.migrations";
import {ICollection, IDb} from "@vitologi/local-db";
import {IBaseEventDto} from "../../shared/dtos/base-event.dto";

describe("events.migrations", ()=>{
  let mockCollection: jest.Mocked<ICollection<IBaseEventDto<unknown>>>;
  let mockDb: jest.Mocked<IDb>;

  beforeAll(async ()=>{
    mockCollection = {
      insertOne: jest.fn().mockResolvedValue(void 0)
    } as unknown as jest.Mocked<ICollection<IBaseEventDto<unknown>>>;

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
    const first  = eventsMigrations[0];
    await first.up(mockDb);

    expect(mockDb.createCollection).toHaveBeenCalledTimes(1);
    expect(mockDb.createCollection.mock.calls[0][0]).toBe("events");
  });

  test('check initial migration down', async ()=>{
    const first  = eventsMigrations[0];
    await first.down(mockDb);
    expect(mockDb.dropCollection).toHaveBeenCalledTimes(1);
  });

});
