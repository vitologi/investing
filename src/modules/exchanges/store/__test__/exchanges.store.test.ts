import {when} from "mobx";
import {IntlStore} from "../../../intl/store/intl.store";
import {StorageService} from "../../../../shared/services/storage.service";

// import {LanguageCode} from "../../../intl/shared/enums/language-code";
// import {sleep} from "../../../../shared/utils/sleep";
import {ExchangeService} from "../../shared/services/exchange.service";
import {ExchangeStore} from "../exchange.store";

jest.mock("../../shared/services/exchange.service");
jest.mock("../../../intl/store/intl.store");
jest.mock("../../../../shared/services/storage.service");


describe('ExchangeStore', () => {
  let mockExchangeService: jest.Mocked<ExchangeService>;
  let mockIntlStore: jest.Mocked<IntlStore>;
  let mockStorageService: jest.Mocked<StorageService>;
  let store: ExchangeStore;

  beforeEach(() => {
    mockExchangeService = new ExchangeService() as jest.Mocked<ExchangeService>;
    mockIntlStore = new IntlStore() as jest.Mocked<IntlStore>;
    mockStorageService = new StorageService() as jest.Mocked<StorageService>;

    store = new ExchangeStore(
      mockExchangeService,
      mockIntlStore,
      mockStorageService,
    );
  });

  test('init (should use lazy initialization)', async () => {
    // automatically
    expect(store.isInit).toBeFalsy();
    await when(() => store.isInit);
    expect(store.isInit).toBeTruthy();

    // manual
    store.isInit = false;
    expect(store.isInit).toBeFalsy();
    store.init();
    expect(store.isInit).toBeTruthy();
  });



})
