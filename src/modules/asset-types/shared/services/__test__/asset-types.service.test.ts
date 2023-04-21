import {AssetTypesService} from "../asset-types.service";

jest.mock("../../../offline/asset-type.db");
describe('AssetTypesService', ()=>{
  let service: AssetTypesService;

  beforeAll(async ()=>{
    service = new AssetTypesService();
  });

  test('created', ()=>{
    expect(service).toBeTruthy();
  });

  test('list (should call find method)', async ()=>{
    expect(await service.list()).toEqual('find');
  });

  test('create (should call insertOne method)', async ()=>{
    expect(await service.create({_id:'_id',name:'name',isSystem:false})).toEqual({_id:'_id',name:'name',isSystem:false});
  });

  test('delete (should call deleteOne method)', async ()=>{
    expect(await service.delete('id')).toBeUndefined();
  });

  test('get (should call findOne method)', async ()=>{
    expect(await service.get('id')).toEqual('findOne');
  });

  test('update (should call updateOne method)', async ()=>{
    expect(await service.update({_id:'_id',name:'name',isSystem:false})).toEqual(null);
  });
})

//   async update(dto: IAssetTypeDto): Promise<IAssetTypeDto| null> {
//     const filter = {_id: dto._id};
//     const result = await this._collection.updateOne(filter, {$set:dto}, {});
//
//     return result.upsertedCount ? dto : null;
//   }
// }
