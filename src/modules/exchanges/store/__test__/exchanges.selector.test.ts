import {Container} from "inversify";
import {useExchangeStore} from "../exchange.selector";
import * as iocSelector from "../../../../store/ioc.selector";

jest.mock<typeof import("../../../../store/ioc.selector")>("../../../../store/ioc.selector", ()=>({
  useIocContainer: jest.fn(),
}))

describe('useExchangeStore', ()=>{
  let container: Container;

  beforeAll(() => {
    container = new Container();
  });

  beforeEach(() => {
    container.unbindAll();
    container.bind<boolean>('ExchangeStore').toConstantValue(true);
    (iocSelector as jest.Mocked<typeof import("../../../../store/ioc.selector")>).useIocContainer.mockReturnValue(container);
  });

  test('get store use selector', ()=>{
    expect(iocSelector.useIocContainer).toHaveBeenCalledTimes(0);
    expect(useExchangeStore()).toBe(true);
    expect(iocSelector.useIocContainer).toHaveBeenCalledTimes(1);
  })
})
