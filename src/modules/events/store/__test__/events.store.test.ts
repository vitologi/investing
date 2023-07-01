import {EventsStore} from "../events.store";
import {EventsService} from "../../shared/services/events.service";

jest.mock("../../shared/services/events.service");

describe('EventsStore', () => {

  test('', ()=>{
    const a = new EventsStore(new EventsService());
    expect(a).toBeInstanceOf(EventsStore);
  })
  // let mockExchangeService: jest.Mocked<ExchangeService>;
  // let mockIntlStore: jest.Mocked<IntlStore>;
  // let mockStorageService: jest.Mocked<StorageService>;
  // let store: EventsStore;
  //
  // beforeEach(() => {
  //   mockExchangeService = new ExchangeService() as jest.Mocked<ExchangeService>;
  //   mockIntlStore = new IntlStore() as jest.Mocked<IntlStore>;
  //   mockStorageService = new StorageService() as jest.Mocked<StorageService>;
  //
  //   store = new EventsStore(
  //     mockExchangeService,
  //     mockIntlStore,
  //     mockStorageService,
  //   );
  // });
  //
  // test('init (should use lazy initialization)', async () => {
  //   // automatically
  //   // expect(store.isInit).toBeFalsy();
  //   await when(() => store.isInit);
  //   expect(store.isInit).toBeTruthy();
  //
  //   // manual
  //   store.isInit = false;
  //   expect(store.isInit).toBeFalsy();
  //   store.init();
  //   expect(store.isInit).toBeTruthy();
  // });
  //
  // test('toggleEnabled (should store values)', async ()=>{
  //   expect(store.enabled).toEqual(["XNYS", "XNAS"]);
  //   expect(mockStorageService.set).toHaveBeenCalledTimes(0);
  //   store.toggleEnabled('XNYS');
  //
  //   expect(mockStorageService.set).toHaveBeenCalledTimes(1);
  //   expect(mockStorageService.set).toHaveBeenCalledWith(ENABLED_EXCHANGES, ['XNAS']);
  //
  //   store.toggleEnabled('XNYS');
  //   expect(mockStorageService.set).toHaveBeenCalledWith(ENABLED_EXCHANGES, ['XNAS', 'XNYS']);
  // });
  //
  // test('isEnabled (should return what exchange is enabled)', ()=>{
  //   expect(store.isEnabled("XNYS")).toBeTruthy();
  //   expect(store.isEnabled("XNYSss")).toBeFalsy();
  // });
  //
  // test('getExchangeByMic (should return exchange id by mic)', async ()=>{
  //   await when(()=>store.isInit);
  //   expect(store.getExchangeByMic('MOEX')).toBe('MOEX');
  //   expect(store.getExchangeByMic('unknown mic')).toBe(null);
  // });
  //
  // test('getExchangeBySuffix (should return exchange id by suffix)', async ()=>{
  //   await when(()=>store.isInit);
  //   expect(store.getExchangeBySuffix('.ME')).toBe('MOEX');
  //   expect(store.getExchangeBySuffix('unknown suffix')).toBe(null);
  // });
  //
  // test('createEmpty (should return error)', async ()=>{
  //   expect(()=>store.createEmpty()).toThrowError();
  // });
  //
  // test('createFromDto (should create Exchange model)', async ()=>{
  //   expect(store.createFromDto(enExch)).toBeInstanceOf(Exchange);
  // });
  //
  // test('enabledList (should provide only enabled exchanges)', async ()=>{
  //   await when(()=>store.isInit);
  //
  //   expect(store.list.length).toBe(3);  // contains 3 mock dto
  //   expect(store.enabledList.length).toBe(1); // only one from them is enabled
  // });
  //
  // test('sortedByEnablingList (should provide sorted list)', async ()=>{
  //   await when(()=>store.isInit);
  //   const list = store.list.map((item)=>item.asDto);
  //   const lastItem = list[list.length-1];
  //   store.toggleEnabled(lastItem._id); // enable last
  //   const sortedList = store.sortedByEnablingList.map((item)=>item.asDto);
  //   list.unshift(lastItem);
  //   list.length--;
  //   expect(sortedList).toEqual(list);
  // });

});
