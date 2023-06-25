import {ManualStore} from "../manual.store";
import {StorageService} from "../../../../shared/services/storage.service";

jest.mock("../../../../shared/services/storage.service");

describe('ManualStore', () => {
  let store: ManualStore;
  let mockStorageService: jest.Mocked<StorageService>;

  beforeEach(() => {
    mockStorageService = new StorageService() as jest.Mocked<StorageService>;
    store = new ManualStore(mockStorageService);
  });

  test('should have initial values', () => {
    expect(store.isInit).toBeFalsy();
    expect(store.isDemoDialogOpened).toBeTruthy();
  });

  test('setIsInit (should save init state)', () => {
    expect(store.isInit).toBeFalsy();
    store.setIsInit(true);
    expect(store.isInit).toBeTruthy();
    expect(mockStorageService.set).toBeCalledTimes(1);
  });

  test('closeDemoDialog (should save close dialog state)', () => {
    expect(store.isDemoDialogOpened).toBeTruthy();
    store.closeDemoDialog();
    expect(store.isDemoDialogOpened).toBeFalsy();
    expect(mockStorageService.set).toBeCalledTimes(1);
  });
});
