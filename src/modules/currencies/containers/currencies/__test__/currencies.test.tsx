import {clearTimers} from "mobx-react-lite";
import {cleanup, render} from "../../../../../test-utils";
import {Currencies} from "../currencies";
import {Container} from "inversify";
import {CurrenciesStore} from "../../../store/currencies.store";
import {DiProvider} from "../../../../../shared/components/di/di.provider";
import {IntlStore} from "../../../../intl/store/intl.store";
import {CurrenciesService} from "../../../shared/services/currencies.service";
import {CurrencyRatesService} from "../../../shared/services/currency-rates.service";
import {StorageService} from "../../../../../shared/services/storage.service";
import {mockedList} from "../../../shared/dtos/__mocks__/currency.dto";
import {when} from "mobx";
import userEvent from "@testing-library/user-event";
import {within} from "@testing-library/react";

jest.mock("../../../shared/services/currencies.service");
jest.mock("../../../shared/services/currency-rates.service");
jest.mock("../../../../intl/store/intl.store");
jest.mock("../../../../../shared/services/storage.service");

describe('Currencies', () => {
  let di: Container;
  let mockIntlStore: jest.Mocked<IntlStore>;
  let mockCurrenciesService: jest.Mocked<CurrenciesService>;
  let mockStore: CurrenciesStore;

  beforeAll(() => {
    mockIntlStore = {formatMessage: (id: string) => id} as jest.Mocked<IntlStore>;
    mockCurrenciesService = new CurrenciesService() as jest.Mocked<CurrenciesService>;
    mockCurrenciesService.list.mockResolvedValue(mockedList);
    mockStore = new CurrenciesStore(
      mockCurrenciesService,
      new CurrencyRatesService(),
      new IntlStore(),
      new StorageService(),
    );

    di = new Container();
    di.bind<IntlStore>('IntlStore').toConstantValue(mockIntlStore);
    di.bind<CurrenciesStore>('CurrenciesStore').toConstantValue(mockStore);
  });

  // TODO: find out needs
  afterEach(() => {
    clearTimers();
    cleanup();
  });

  test('should render list', async () => {
    const {getByRole} = render(<DiProvider container={di}><Currencies/></DiProvider>);
    expect(getByRole('list')).toBeTruthy();
  });

  test('should render items', async () => {
    await when(() => mockStore.isInit);
    const {getAllByRole} = render(<DiProvider container={di}><Currencies/></DiProvider>);
    expect(getAllByRole('listitem').length).toBe(2);
  });

  test('should select item', async () => {
    const spy = jest.spyOn(mockStore, 'toggleEnabled');
    await when(() => mockStore.isInit);
    const {getAllByRole} = render(<DiProvider container={di}><Currencies/></DiProvider>);
    const firstItem = getAllByRole('listitem')[0];
    const checkbox = within(firstItem).getByRole('checkbox');
    await userEvent.click(checkbox);

    expect(spy).toHaveBeenCalledTimes(1);
  });

});
