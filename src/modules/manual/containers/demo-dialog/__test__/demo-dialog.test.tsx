import {cleanup, render} from "../../../../../test-utils";
import {Container} from "inversify";
import {IntlStore} from "../../../../intl/store/intl.store";
import * as reactRouter from "react-router";
import {clearTimers} from "mobx-react-lite";
import {StorageService} from "../../../../../shared/services/storage.service";
import {ManualStore} from "../../../store/manual.store";
import {CurrenciesService} from "../../../../currencies/shared/services/currencies.service";
import {CurrencyRatesService} from "../../../../currencies/shared/services/currency-rates.service";
import {CurrenciesStore} from "../../../../currencies/store/currencies.store";
import {PortfoliosService} from "../../../../portfolios/shared/services/portfolios.service";
import {PortfoliosStore} from "../../../../portfolios/store/portfolios.store";
import {TransactionsService} from "../../../../transactions/shared/services/transactions.service";
import {TransactionsStore} from "../../../../transactions/store/transactions.store";
import {ExchangeStore} from "../../../../exchanges/store/exchange.store";
import {ExchangeService} from "../../../../exchanges/shared/services/exchange.service";
import {AssetTypesStore} from "../../../../asset-types/store/asset-types.store";
import {AssetTypesService} from "../../../../asset-types/shared/services/asset-types.service";
import {TickersStore} from "../../../../tickers/store/tickers.store";
import {TickersService} from "../../../../tickers/shared/services/tickers.service";
import {TransactionsTransferStore} from "../../../../transactions/store/transactions-transfer.store";
import {DiProvider} from "../../../../../shared/components/di/di.provider";
import {DemoDialog} from "../demo-dialog";
import {fireEvent} from "@testing-library/react";


jest.mock("../../../../tickers/shared/services/tickers.service");
jest.mock("../../../../asset-types/shared/services/asset-types.service");
jest.mock("../../../../exchanges/shared/services/exchange.service");
jest.mock("../../../../transactions/shared/services/transactions.service");
jest.mock("../../../../currencies/shared/services/currencies.service");
jest.mock("../../../../currencies/shared/services/currency-rates.service");
jest.mock("../../../../../shared/services/storage.service");
jest.mock("../../../../portfolios/shared/services/portfolios.service");


describe('DemoDialog', ()=>{
  let di: Container;
  let navigate: jest.Mocked<ReturnType<typeof reactRouter.useNavigate>>;
  const mockStorageService = new StorageService();
  const mockCurrenciesService = new CurrenciesService();
  const mockCurrencyRatesService = new CurrencyRatesService();
  const mockPortfolioService = new PortfoliosService();
  const mockTransactionsService = new TransactionsService();
  const mockExchangeService = new ExchangeService();
  const mockAssetTypesService = new AssetTypesService();
  const mockTikersService = new TickersService();
  const intlStore = new IntlStore();
  const mockAssetTypesStore = new AssetTypesStore(mockAssetTypesService);
  const mockExchangeStore = new ExchangeStore(mockExchangeService, intlStore, mockStorageService);
  const mockTransactionsStore = new TransactionsStore(mockTransactionsService);
  const mockManualStore = new ManualStore(mockStorageService);
  const mockCurrenciesStore = new CurrenciesStore(mockCurrenciesService, mockCurrencyRatesService, intlStore, mockStorageService);
  const mockPortfolioStore = new PortfoliosStore(mockPortfolioService);
  const mockTickersStore = new TickersStore(
    mockTikersService,
    mockTransactionsStore,
    mockCurrenciesStore,
    mockAssetTypesStore,
    mockPortfolioStore,
  );
  const mockTransferStore = new TransactionsTransferStore(
    mockTransactionsStore,
    mockCurrenciesStore,
    mockPortfolioStore,
    mockExchangeStore,
    mockAssetTypesStore,
    mockTickersStore,
  );

  beforeAll(() => {
    // TODO: need to do di builder for tests, or maybe for app too
    di = new Container();
    new StorageService();

    di.bind<ManualStore>('ManualStore').toConstantValue(mockManualStore)
    di.bind<IntlStore>('IntlStore').toConstantValue(intlStore);
    di.bind<TransactionsTransferStore>('TransactionsTransferStore').toConstantValue(mockTransferStore);
    di.bind<CurrenciesStore>('CurrenciesStore').toConstantValue(mockCurrenciesStore);
    di.bind<TransactionsStore>('TransactionsStore').toConstantValue(mockTransactionsStore);
  });

  beforeEach(() => {
    di.snapshot();
    navigate = jest.fn();
    jest.spyOn(reactRouter, 'useNavigate').mockReturnValue(navigate);
  });

  afterEach(() => {
    clearTimers();
    cleanup();
    di.restore();
  });

  test('', ()=>{
    const {getByRole} = render(<DiProvider container={di}><DemoDialog/></DiProvider>)

    expect(getByRole("dialog")).toBeVisible();
  });

  test('', async ()=>{
    const {getByText, getByRole} = render(<DiProvider container={di}><DemoDialog/></DiProvider>)


    const rejectButton = getByText(intlStore.formatMessage("app.common.actions.reject"));
    fireEvent.click(rejectButton);
    expect(getByRole("dialog")).not.toBeVisible();
  });

})
