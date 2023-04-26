import * as reactRouter from "react-router";
import {clearTimers} from "mobx-react-lite";
import {cleanup, render} from "../../../../../test-utils";
import {Container} from "inversify";
import {AssetTypesStore} from "../../../store/asset-types.store";
import {IntlStore} from "../../../../intl/store/intl.store";
import {DiProvider} from "../../../../../shared/components/di/di.provider";
import {AssetTypesService} from "../../../shared/services/asset-types.service";
import {AssetTypeForm} from "../asset-type-form";

jest.mock("../../../shared/services/asset-types.service");
jest.mock("../../../store/asset-types.store");

describe('AssetTypeList', () => {
  let container: Container;
  let navigate: jest.Mocked<ReturnType<typeof reactRouter.useNavigate>>;
  const mockIntlStore = {formatMessage: (id: string) => id} as IntlStore;
  const mockAssetTypesStore = new AssetTypesStore(new AssetTypesService());

  beforeAll(() => {
    container = new Container();
    container.bind<IntlStore>('IntlStore').toConstantValue(mockIntlStore);
    container.bind<AssetTypesStore>('AssetTypesStore').toConstantValue(mockAssetTypesStore)
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
    const {getByTestId} = render(<DiProvider container={container}><AssetTypeForm/></DiProvider>);
    expect(getByTestId("assetTypeForm")).toBeTruthy();
  });

});
