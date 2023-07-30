import {render} from "../../../../../test-utils";
import {Container} from "inversify";
import {IntlStore} from "../../../../intl/store/intl.store";
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
import {buildIoc} from "../../../../../store/build-ioc";
import {EventsService} from "../../../../events/shared/services/events.service";
import {EventsStore} from "../../../../events/store/events.store";
import {StorageService} from "../../../../../shared/services/storage.service";
import {CommandsStore} from "../../../../events/store/commands.store";


jest.mock("../../../../../shared/services/storage.service");
jest.mock("../../../../tickers/shared/services/tickers.service");
jest.mock("../../../../asset-types/shared/services/asset-types.service");
jest.mock("../../../../exchanges/shared/services/exchange.service");
jest.mock("../../../../transactions/shared/services/transactions.service");
jest.mock("../../../../currencies/shared/services/currencies.service");
jest.mock("../../../../currencies/shared/services/currency-rates.service");
jest.mock("../../../../portfolios/shared/services/portfolios.service");
jest.mock("../../../../events/shared/services/events.service");


describe('DemoDialog', ()=>{
  let di: Container;


  beforeAll(() => {
    di = buildIoc([
      StorageService, EventsService, EventsStore, CurrenciesService,CurrencyRatesService,
      PortfoliosService,TransactionsService,ExchangeService,AssetTypesService,
      TickersService,IntlStore,AssetTypesStore,ExchangeStore,TransactionsStore,
      ManualStore,CurrenciesStore,PortfoliosStore,TickersStore,TransactionsTransferStore,
      CommandsStore,
    ]);

  });

  beforeEach(() => {
    di.snapshot();
  });

  afterEach(() => {
    di.restore();
  });

  test('render dialog', ()=>{
    const {getByRole} = render(<DiProvider container={di}><DemoDialog/></DiProvider>)

    expect(getByRole("dialog")).toBeVisible();
  });

  test('close dialog', async ()=>{
    const intlStore = di.get<IntlStore>(IntlStore.key);
    const {getByText, getByRole} = render(<DiProvider container={di}><DemoDialog/></DiProvider>)

    const rejectButton = getByText(intlStore.formatMessage("app.common.actions.reject"));
    fireEvent.click(rejectButton);
    expect(getByRole("dialog")).not.toBeVisible();
  });

  test('confirm dialog', async ()=>{
    const intlStore = di.get<IntlStore>(IntlStore.key);
    const mockManualStore = di.get<ManualStore>(ManualStore.key);
    const mockCurrenciesStore = di.get<CurrenciesStore>(CurrenciesStore.key);
    const mockTransferStore = di.get<TransactionsTransferStore>(TransactionsTransferStore.key);

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
  });

  test('should alert if error confirmation was appeared', async ()=>{
    const intlStore = di.get<IntlStore>(IntlStore.key);
    const mockTransferStore = di.get<TransactionsTransferStore>(TransactionsTransferStore.key);
    const {getByText} = render(<DiProvider container={di}><DemoDialog/></DiProvider>)
    const spyAlert = jest.spyOn(global.window, 'alert').mockReturnValue();
    jest.spyOn(mockTransferStore, 'importTransactions').mockRejectedValue(new Error('Some error'));

    const confirmButton = getByText(intlStore.formatMessage("app.common.actions.confirm"));
    fireEvent.click(confirmButton);

    await waitFor(()=>expect(spyAlert).toHaveBeenCalled());
    expect(spyAlert).toHaveBeenCalledWith(intlStore.formatMessage("app.common.actions.error"));
  });

})
