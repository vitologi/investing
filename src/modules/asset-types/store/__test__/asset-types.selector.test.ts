import {Container} from "inversify";
import {useAssetTypesStore} from "../asset-types.selector";
import * as iocSelector from "../../../../store/ioc.selector";
import {AssetTypesStore} from "../asset-types.store";
jest.mock<typeof import("../../../../store/ioc.selector")>("../../../../store/ioc.selector", ()=>({
  useIocContainer: jest.fn(),
}))

describe('useAssetTypesStore', ()=>{
  let container: Container;

  beforeAll(() => {
    container = new Container();
  });

  beforeEach(() => {
    container.unbindAll();
    container.bind<boolean>(AssetTypesStore.key).toConstantValue(true);
    (iocSelector as jest.Mocked<typeof import("../../../../store/ioc.selector")>).useIocContainer.mockReturnValue(container);
  });

  test('get store use selector', ()=>{
    expect(iocSelector.useIocContainer).toHaveBeenCalledTimes(0);
    expect(useAssetTypesStore()).toBe(true);
    expect(iocSelector.useIocContainer).toHaveBeenCalledTimes(1);
  })
})
