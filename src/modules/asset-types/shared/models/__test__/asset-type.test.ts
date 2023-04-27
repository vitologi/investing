import {AssetType} from "../asset-type";
import {AssetTypesStore} from "../../../store/asset-types.store";
import {AssetTypesService} from "../../services/asset-types.service";

jest.mock("../../services/asset-types.service");
jest.mock("../../../store/asset-types.store");

describe('AssetType', () => {
  let model: AssetType;
  let store: AssetTypesStore;
  const defaultDto = {
    _id: "id",
    name: "",
    isSystem: false,
  };

  beforeAll(() => {
    store = new AssetTypesStore(new AssetTypesService());
  });

  beforeEach(() => {
    model = new AssetType(store, "id");
  });

  test('created', () => {
    expect(model).toBeTruthy();
  });

  test('asDto (has default values)', () => {
    expect(model.asDto).toEqual(defaultDto);
  });

  test('updateFromDto (can be updated)', async () => {
    const newDto = {_id: 'id', name: 'update name', isSystem: true};
    expect(model.asDto).toEqual(defaultDto);
    model.updateFromDto(newDto);
    expect(model.asDto).toEqual(newDto);
  });

  test('delete (should delete model)', async () => {
    const spy = jest.spyOn(store, 'delete');
    expect(spy).toHaveBeenCalledTimes(0);
    await model.delete();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(defaultDto);
  });

  test('delete (shouldn`t delete system type)', async () => {
    const spy = jest.spyOn(store, 'delete');
    model.isSystem = true;

    expect(spy).toHaveBeenCalledTimes(0);
    await model.delete();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  test('dispose (should do nothing)', async () => {
    const spy = jest.spyOn(store, 'delete');
    expect(model.asDto).toEqual(defaultDto);
    expect(spy).toHaveBeenCalledTimes(0);
    model.dispose();
    expect(model.asDto).toEqual(defaultDto);
    expect(spy).toHaveBeenCalledTimes(0);
  });

});
