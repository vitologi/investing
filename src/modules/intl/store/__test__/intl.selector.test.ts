import {Container} from "inversify";
import {useIntlStore} from "../intl.selector";
import * as iocSelector from "../../../../store/ioc.selector";

jest.mock("../../../../store/ioc.selector");

describe('useIntlStore', ()=>{
  let di: Container;
  let spy: jest.SpyInstance;

  beforeAll(()=>{
    di = new Container();
  });

  beforeEach(()=>{
    di.unbindAll();
    di.bind<boolean>('IntlStore').toConstantValue(true);
    spy = jest.spyOn(iocSelector, 'useIocContainer').mockReturnValue(di);
  });

  test('get store use selector', ()=>{
    expect(spy).toHaveBeenCalledTimes(0);
    expect(useIntlStore()).toBe(true);
    expect(spy).toHaveBeenCalledTimes(1);
  })
})
