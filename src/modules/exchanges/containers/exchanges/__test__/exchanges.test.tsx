import {Container} from "inversify";
import {within} from "@testing-library/react";
import {when} from "mobx";
import userEvent from "@testing-library/user-event";
import {render} from "../../../../../test-utils";
import {DiProvider} from "../../../../../shared/components/di/di.provider";
import {Exchanges} from "../exchanges";
import {ExchangeStore} from "../../../store/exchange.store";
import {IntlStore} from "../../../../intl/store/intl.store";
import {ExchangeService} from "../../../shared/services/exchange.service";
import {StorageService} from "../../../../../shared/services/storage.service";

jest.mock("../../../../intl/store/intl.store");
jest.mock("../../../shared/services/exchange.service");
jest.mock("../../../../../shared/services/storage.service");


describe('Exchanges', ()=>{
  let container: Container;
  const mockIntlStore = new IntlStore();
  const mockExchangesService = new ExchangeService();
  const mockStorageService = new StorageService();
  const mockExchangesStore = new ExchangeStore(
    mockExchangesService,
    mockIntlStore,
    mockStorageService
  );

  beforeAll(()=>{
    container = new Container();
    container.bind('ExchangeStore').toConstantValue(mockExchangesStore);
    container.bind('IntlStore').toConstantValue(mockIntlStore);
  });

  test('should be instantiated', ()=>{
    const {getByRole} = render(<DiProvider container={container}><Exchanges/></DiProvider> );
    expect(getByRole('list')).toBeInTheDocument();
  })

  test('should toggle enabled exchanges', async ()=>{
    const spy = jest.spyOn(mockExchangesStore, 'toggleEnabled');
    await when(()=>mockExchangesStore.isInit);
    const {getAllByRole} = render(<DiProvider container={container}><Exchanges/></DiProvider> );
    const item = getAllByRole('listitem')[0];
    const checkbox = within(item).getByRole('checkbox')
    await userEvent.click(checkbox);
    expect(spy).toHaveBeenCalledTimes(1);
  })

});
