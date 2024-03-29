import {Container} from "inversify";
import {when} from "mobx";
import {AssetTypesStore} from "../asset-types.store";
import {AssetType} from "../../shared/models/asset-type";
import defaultAssetTypes from "../../offline/asset-types.mocks.json";
import {BaseApiService} from "../../../../shared/interfaces/base-api.service";
import {IAssetTypeDto} from "../../shared/dtos/asset-type.dto";
import {AssetTypesService} from "../../shared/services/asset-types.service";

jest.mock("../../shared/services/asset-types.service");

describe('AssetTypesStore', () => {
  let container: Container;
  let assetTypesServiceMock: jest.Mocked<AssetTypesService>;
  let store: AssetTypesStore;
  const assetTypeDto = {
    _id: '_id',
    name: 'name',
    isSystem: false
  };

  beforeAll(() => {
    container = new Container();
  });

  // TODO: remove container, use mocked service directly through constructor
  beforeEach(() => {
    assetTypesServiceMock = new AssetTypesService() as jest.Mocked<AssetTypesService>;
    container.unbindAll();
    container.bind<BaseApiService<IAssetTypeDto>>(AssetTypesService.key).toConstantValue(assetTypesServiceMock);
    container.bind<AssetTypesStore>(AssetTypesStore.key).to(AssetTypesStore);
    store = container.get<AssetTypesStore>(AssetTypesStore.key);
  });

  test('created', () => {
    expect(store).toBeTruthy();
  });

  test('init (should use lazy initialization)', async () => {
    // automatically
    expect(store.isInit).toBeFalsy();
    await when(() => store.isInit);
    expect(store.isInit).toBeTruthy();

    // manual
    store.isInit = false;
    expect(store.isInit).toBeFalsy();
    store.init();
    expect(store.isInit).toBeTruthy();
  });



  test('createEmpty', () => {
    expect(store.createEmpty()).toBeInstanceOf(AssetType);
  });

  test('createFromDto', () => {
    const model = store.createFromDto(assetTypeDto);
    expect(model).toBeInstanceOf(AssetType);
    expect(model.asDto).toEqual(assetTypeDto);
  });

  test('has default values', async () => {
    await when(() => store.isInit);
    const dtos = store.list.map(item => item.asDto);
    dtos.sort((a, b) => a._id > b._id ? 1 : -1);
    defaultAssetTypes.sort((a, b) => a._id > b._id ? 1 : -1);
    expect(dtos).toEqual(defaultAssetTypes);
  })

  test('create ', async () => {
    expect(assetTypesServiceMock.create).toHaveBeenCalledTimes(0);
    await store.create(assetTypeDto);
    expect(assetTypesServiceMock.create).toHaveBeenCalledTimes(1);
  });
})
