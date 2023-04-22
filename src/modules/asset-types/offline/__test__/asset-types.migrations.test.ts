import defaultValues from '../asset-types.mocks.json';
import {assetTypesMigrations} from "../asset-types.migrations";
import {ICollection, IDb} from "@vitologi/local-db";
import {IAssetTypeDto} from "../../shared/interfaces/asset-type.dto";

describe("asset-types.migrations", ()=>{
  let mockCollection: jest.Mocked<ICollection<IAssetTypeDto>>;
  let mockDb: jest.Mocked<IDb>;

  beforeAll(async ()=>{
    mockCollection = {
      insertOne: jest.fn().mockResolvedValue(void 0)
    } as unknown as jest.Mocked<ICollection<IAssetTypeDto>>;

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
    const first  = assetTypesMigrations[0];
    await first.up(mockDb);

    expect(mockDb.collection).toHaveBeenCalledWith("assetTypes");
    expect(mockDb.createCollection).toHaveBeenCalledTimes(1);
    expect(mockDb.collection).toHaveBeenCalledTimes(1);
    expect(mockCollection.insertOne).toHaveBeenCalledTimes(defaultValues.length);
  });

  test('check initial migration down', async ()=>{
    const first  = assetTypesMigrations[0];
    await first.down(mockDb);
    expect(mockDb.dropCollection).toHaveBeenCalledTimes(1);
  });

});
