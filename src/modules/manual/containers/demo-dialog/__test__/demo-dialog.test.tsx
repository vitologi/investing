import {render} from "../../../../../test-utils";
import {Container} from "inversify";
import {IntlStore} from "../../../../intl/store/intl.store";
import * as reactRouter from "react-router";
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
import {fireEvent, waitFor} from "@testing-library/react";


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
  let mockStorageService = new StorageService();
  let mockCurrenciesService = new CurrenciesService();
  let mockCurrencyRatesService = new CurrencyRatesService();
  let mockPortfolioService = new PortfoliosService();
  let mockTransactionsService = new TransactionsService();
  let mockExchangeService = new ExchangeService();
  let mockAssetTypesService = new AssetTypesService();
  let mockTikersService = new TickersService();
  let intlStore = new IntlStore();
  let mockAssetTypesStore = new AssetTypesStore(mockAssetTypesService);
  let mockExchangeStore = new ExchangeStore(mockExchangeService, intlStore, mockStorageService);
  let mockTransactionsStore = new TransactionsStore(mockTransactionsService);
  let mockManualStore = new ManualStore(mockStorageService);
  let mockCurrenciesStore = new CurrenciesStore(mockCurrenciesService, mockCurrencyRatesService, intlStore, mockStorageService);
  let mockPortfolioStore = new PortfoliosStore(mockPortfolioService);
  let mockTickersStore = new TickersStore(
    mockTikersService,
    mockTransactionsStore,
    mockCurrenciesStore,
    mockAssetTypesStore,
    mockPortfolioStore,
  );
  let mockTransferStore = new TransactionsTransferStore(
    mockTransactionsStore,
    mockCurrenciesStore,
    mockPortfolioStore,
    mockExchangeStore,
    mockAssetTypesStore,
    mockTickersStore,
  );

  beforeEach(() => {
    mockStorageService = new StorageService();
    mockCurrenciesService = new CurrenciesService();
    mockCurrencyRatesService = new CurrencyRatesService();
    mockPortfolioService = new PortfoliosService();
    mockTransactionsService = new TransactionsService();
    mockExchangeService = new ExchangeService();
    mockAssetTypesService = new AssetTypesService();
    mockTikersService = new TickersService();
    intlStore = new IntlStore();
    mockAssetTypesStore = new AssetTypesStore(mockAssetTypesService);
    mockExchangeStore = new ExchangeStore(mockExchangeService, intlStore, mockStorageService);
    mockTransactionsStore = new TransactionsStore(mockTransactionsService);
    mockManualStore = new ManualStore(mockStorageService);
    mockCurrenciesStore = new CurrenciesStore(mockCurrenciesService, mockCurrencyRatesService, intlStore, mockStorageService);
    mockPortfolioStore = new PortfoliosStore(mockPortfolioService);

    mockTickersStore = new TickersStore(
      mockTikersService,
      mockTransactionsStore,
      mockCurrenciesStore,
      mockAssetTypesStore,
      mockPortfolioStore,
    );
    mockTransferStore = new TransactionsTransferStore(
      mockTransactionsStore,
      mockCurrenciesStore,
      mockPortfolioStore,
      mockExchangeStore,
      mockAssetTypesStore,
      mockTickersStore,
    );

    // TODO: need to do di builder for tests, or maybe for app too
    di = new Container();

    di.bind<ManualStore>('ManualStore').toConstantValue(mockManualStore);
    di.bind<IntlStore>('IntlStore').toConstantValue(intlStore);
    di.bind<TransactionsTransferStore>('TransactionsTransferStore').toConstantValue(mockTransferStore);
    di.bind<CurrenciesStore>('CurrenciesStore').toConstantValue(mockCurrenciesStore);
    di.bind<TransactionsStore>('TransactionsStore').toConstantValue(mockTransactionsStore);
  });

  beforeEach(() => {
    // di.snapshot();
    navigate = jest.fn();
    jest.spyOn(reactRouter, 'useNavigate').mockReturnValue(navigate);
  });

  afterEach(() => {
    // di.restore();
  });

  test('render dialog', ()=>{
    const {getByRole} = render(<DiProvider container={di}><DemoDialog/></DiProvider>)

    expect(getByRole("dialog")).toBeVisible();
  });

  test('close dialog', async ()=>{
    const {getByText, getByRole} = render(<DiProvider container={di}><DemoDialog/></DiProvider>)


    const rejectButton = getByText(intlStore.formatMessage("app.common.actions.reject"));
    fireEvent.click(rejectButton);
    expect(getByRole("dialog")).not.toBeVisible();
  });

  test('confirm dialog', async ()=>{
    const {getByText, getByRole} = render(<DiProvider container={di}><DemoDialog/></DiProvider>)
    expect(getByRole('dialog')).toBeInTheDocument();
    const spyCloseDialog = jest.spyOn(mockManualStore, 'closeDemoDialog').mockReturnValue();
    const spyImportTransactions = jest.spyOn(mockTransferStore, 'importTransactions').mockResolvedValue();
    const spyAlert = jest.spyOn(global.window, 'alert').mockReturnValue();
    const spySetRateProvider = jest.spyOn(mockCurrenciesStore, 'setRateProvider').mockReturnValue();
    const spySetExchangeApiToken = jest.spyOn(mockCurrenciesStore, 'setOpenExchangeRatesApiToken').mockReturnValue();

    const confirmButton = getByText(intlStore.formatMessage("app.common.actions.confirm"));
    fireEvent.click(confirmButton);

    await waitFor(()=>expect(spyAlert).toHaveBeenCalled());
    expect(spyCloseDialog).toHaveBeenCalled();
    expect(spyImportTransactions).toHaveBeenCalled();
    expect(spySetRateProvider).toHaveBeenCalled();
    expect(spySetExchangeApiToken).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalled();
  });

  test('should alert if error confirmation was appeared', async ()=>{
    const {getByText} = render(<DiProvider container={di}><DemoDialog/></DiProvider>)
    const spyAlert = jest.spyOn(global.window, 'alert').mockReturnValue();
    jest.spyOn(mockTransferStore, 'importTransactions').mockRejectedValue(new Error('Some error'));

    const confirmButton = getByText(intlStore.formatMessage("app.common.actions.confirm"));
    fireEvent.click(confirmButton);

    await waitFor(()=>expect(spyAlert).toHaveBeenCalled());
    expect(spyAlert).toHaveBeenCalledWith(intlStore.formatMessage("app.common.actions.error"));
  });

})
