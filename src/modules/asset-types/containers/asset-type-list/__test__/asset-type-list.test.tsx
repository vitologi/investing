import * as reactRouter from "react-router";
import {clearTimers} from "mobx-react-lite";
import {cleanup, fireEvent, render} from "../../../../../test-utils";
import {AssetTypeList} from "../asset-type-list";
import {Container} from "inversify";
import {AssetTypesStore} from "../../../store/asset-types.store";
import {IntlStore} from "../../../../intl/store/intl.store";
import {DiProvider} from "../../../../../shared/components/di/di.provider";
import {AssetTypesService} from "../../../shared/services/asset-types.service";
import userEvent from "@testing-library/user-event";

jest.mock("../../../shared/services/asset-types.service");
jest.mock("../../../store/asset-types.store");

describe('AssetTypeList', () => {
  let container: Container;
  let navigate: jest.Mocked<ReturnType<typeof reactRouter.useNavigate>>;
  const mockIntlStore = {formatMessage: (id: string) => id} as IntlStore;
  const mockAssetTypesStore = new AssetTypesStore(new AssetTypesService());

  beforeAll(() => {
    container = new Container();
    container.bind<IntlStore>(IntlStore.key).toConstantValue(mockIntlStore);
    container.bind<AssetTypesStore>(AssetTypesStore.key).toConstantValue(mockAssetTypesStore)
  });

  beforeEach(() => {
    navigate = jest.fn();
    jest.spyOn(reactRouter, 'useNavigate').mockReturnValue(navigate);
  });

  afterEach(() => {
    clearTimers();
    cleanup();
  });


  test('should redirect to add new page after click on add button', async () => {
    const {getByTestId} = render(<DiProvider container={container}><AssetTypeList/></DiProvider>);
    fireEvent.click(getByTestId('addButton'));
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith('new');
  });

  test('should render properly not system item', async () => {
    // create item
    await mockAssetTypesStore.create({_id: "id", name: "notSystemTestItemName", isSystem: false});
    expect(mockAssetTypesStore.list.length).toBe(1);

    // should have a delete button and show it name
    const {getByTestId} = render(<DiProvider container={container}><AssetTypeList/></DiProvider>);
    expect(getByTestId("deleteButton")).toBeTruthy();
    expect(getByTestId("assetTypeName")).toHaveTextContent("notSystemTestItemName");

    // delete button check
    const item = mockAssetTypesStore.list[0];
    const spy = jest.spyOn(item, 'delete');
    expect(spy).toHaveBeenCalledTimes(0);
    await userEvent.click(getByTestId('deleteButton'));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('should render properly system item', async () => {
    // create item
    await mockAssetTypesStore.create({"_id": "CURRENCY", "isSystem": true, "name": "CURRENCY"});

    // should not have a delete button and show it name
    const {getByTestId, queryByTestId} = render(
      <DiProvider container={container}>
          <AssetTypeList/>
      </DiProvider>
    );
    expect(queryByTestId("deleteButton")).toBeFalsy();
    expect(getByTestId("assetTypeName")).toHaveTextContent('Currency');
  });

});
