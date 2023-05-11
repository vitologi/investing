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

jest.mock("../../../shared/services/currencies.service");
jest.mock("../../../shared/services/currency-rates.service");
jest.mock("../../../../intl/store/intl.store");
jest.mock("../../../../../shared/services/storage.service");

describe('Currencies', () => {
  let di: Container;
  const mockIntlStore = {formatMessage: (id: string) => id} as IntlStore;
  const mockStore = new CurrenciesStore(
    new CurrenciesService(),
    new CurrencyRatesService(),
    new IntlStore(),
    new StorageService(),
  );

  beforeAll(() => {
    di = new Container();
    di.bind<IntlStore>('IntlStore').toConstantValue(mockIntlStore);
    di.bind<CurrenciesStore>('CurrenciesStore').toConstantValue(mockStore);
  });

  // TODO: find out needs
  afterEach(() => {
    clearTimers();
    cleanup();
  });

  test('should render component', async () => {
    const {getByRole} = render(<DiProvider container={di}><Currencies/></DiProvider>);
    expect(getByRole('list')).toBeTruthy();
  });

});
