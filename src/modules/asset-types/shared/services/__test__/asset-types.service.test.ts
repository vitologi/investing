import {ICollection} from "@vitologi/local-db";
import {AssetTypesService} from "../asset-types.service";
import {assetTypesCollection} from "../../../offline/asset-type.db";
import {IAssetTypeDto} from "../../dtos/asset-type.dto";

jest.mock("../../../offline/asset-type.db", ()=>{
  const mockCollection = {
    find: jest.fn(),
    findOne: jest.fn(),
    deleteOne: jest.fn(),
    insertOne: jest.fn(),
    updateOne: jest.fn(),
  };

  return ({
    __esModule: true,
    assetTypesCollection: jest.fn(()=>mockCollection)
  })
});

describe('AssetTypesService', ()=>{
  let service: AssetTypesService;
  let mockCollection: jest.Mocked<ICollection<IAssetTypeDto>>;

  beforeAll(async ()=>{
    service = new AssetTypesService();
    mockCollection = assetTypesCollection() as unknown as jest.Mocked<ICollection<IAssetTypeDto>>;
  });

  test('created', ()=>{
    expect(service).toBeTruthy();
  });

  test('list (should call find method)', async ()=>{
    await service.list();
    expect(mockCollection.find).toHaveBeenCalledTimes(1);
  });

  test('create (should call insertOne method)', async ()=>{
    await service.create({_id:'_id',name:'name',isSystem:false});
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

    expect(await service.update({_id:'_id',name:'name',isSystem:false})).toEqual({_id:'_id',name:'name',isSystem:false});
    expect(await service.update({_id:'_id',name:'name',isSystem:false})).toEqual(null);
    expect(mockCollection.updateOne).toHaveBeenCalledTimes(2);
  });
})
