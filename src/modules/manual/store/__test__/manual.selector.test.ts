import {Container} from "inversify";
import * as iocSelector from "../../../../store/ioc.selector";
import {useManualStore} from "../manual.selector";
import {ManualStore} from "../manual.store";

jest.mock("../../../../store/ioc.selector");

describe('useManualStore', () => {
  let di: Container;
  let spy: jest.SpyInstance;

  beforeAll(() => {
    di = new Container();
  });

  beforeEach(() => {
    di.unbindAll();
    di.bind<boolean>(ManualStore.key).toConstantValue(true);
    spy = jest.spyOn(iocSelector, 'useIocContainer').mockReturnValue(di);
  });

  test('get store use selector', () => {
    expect(spy).toHaveBeenCalledTimes(0);
    expect(useManualStore()).toBe(true);
    expect(spy).toHaveBeenCalledTimes(1);
  })
})
