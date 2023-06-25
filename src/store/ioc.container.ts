import {buildIoc} from "./build-ioc";
import {StorageService} from "../shared/services/storage.service";
import {IntlStore} from "../modules/intl/store/intl.store";
import {ThemeStore} from "../modules/theme/store/theme.store";
import {DrawersPanelStore} from "../modules/navigation/store/drawers-panel.store";
import {NavigationPanelStore} from "../modules/navigation/store/navigation-panel.store";
import {AssetTypesService} from "../modules/asset-types/shared/services/asset-types.service";
import {AssetTypesStore} from "../modules/asset-types/store/asset-types.store";
import {CurrenciesService} from "../modules/currencies/shared/services/currencies.service";
import {CurrencyRatesService} from "../modules/currencies/shared/services/currency-rates.service";
import {CurrenciesStore} from "../modules/currencies/store/currencies.store";
import {ExchangeService} from "../modules/exchanges/shared/services/exchange.service";
import {ExchangeStore} from "../modules/exchanges/store/exchange.store";
import {PortfoliosService} from "../modules/portfolios/shared/services/portfolios.service";
import {PortfoliosStore} from "../modules/portfolios/store/portfolios.store";
import {TransactionsService} from "../modules/transactions/shared/services/transactions.service";
import {TransactionsStore} from "../modules/transactions/store/transactions.store";
import {TransactionsTransferStore} from "../modules/transactions/store/transactions-transfer.store";
import {SettingsService} from "../modules/settings/shared/services/settings.service";
import {SettingsStore} from "../modules/settings/store/settings.store";
import {TickersService} from "../modules/tickers/shared/services/tickers.service";
import {TickersStore} from "../modules/tickers/store/tickers.store";
import {ManualStore} from "../modules/manual/store/manual.store";

// import {OfflineService} from '../modules/offline/shared/services/offline.service';
// import {NotificationService} from '../modules/notification/shared/services/notification.service';
// import {UserService} from '../modules/auth/shared/services/user.service';
// import {OfflineStore} from '../modules/offline/store/offline.store';

export const iocContainer = buildIoc([
  StorageService,
  IntlStore,
  ThemeStore,
  DrawersPanelStore,
  NavigationPanelStore,
  AssetTypesService,
  AssetTypesStore,
  CurrenciesService,
  CurrencyRatesService,
  CurrenciesStore,
  ExchangeService,
  ExchangeStore,
  PortfoliosService,
  PortfoliosStore,
  TransactionsService,
  TransactionsStore,
  TransactionsTransferStore,
  SettingsService,
  SettingsStore,
  TickersService,
  TickersStore,
  ManualStore,
]);
