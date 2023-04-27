import * as reactRouter from "react-router";
import {clearTimers} from "mobx-react-lite";
import {cleanup, render} from "../../../../../test-utils";
import {Container} from "inversify";
import {AssetTypesStore} from "../../../store/asset-types.store";
import {IntlStore} from "../../../../intl/store/intl.store";
import {DiProvider} from "../../../../../shared/components/di/di.provider";
import {AssetTypesService} from "../../../shared/services/asset-types.service";
import {AssetTypeForm} from "../asset-type-form";
import userEvent from "@testing-library/user-event";
import {IAssetTypeDto} from "../../../shared/interfaces/asset-type.dto";

jest.mock("../../../shared/services/asset-types.service");
jest.mock("../../../store/asset-types.store");

describe('AssetTypeForm', () => {
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

  test('should be instantiated', async () => {
    const {getByRole} = render(<DiProvider container={container}><AssetTypeForm/></DiProvider>);
    expect(getByRole("form", {name: /app.assetTypes.form.form/i})).toBeTruthy();
  });

  test('shouldn`t create new model if inputs are invalid', async () => {
    const spy = jest.spyOn(mockAssetTypesStore, "create");
    const {getByRole, findByRole} = render(<DiProvider container={container}><AssetTypeForm/></DiProvider>);
    const save = () => userEvent.click(getByRole('button', {name: /app.common.actions.save/i}));
    const alert = () => findByRole('alert', {name: /app.common.form.alert/i})

    // empty value
    await save();
    expect(await alert()).toHaveTextContent("Field is required");
    expect(spy).not.toHaveBeenCalled();

    // min length
    await userEvent.type(
      getByRole("textbox", {name: /app.assetTypes.form.name/i}),
      "AA"
    );
    expect(await alert()).toHaveTextContent("Field use length from 3 to 12 characters");
    expect(spy).not.toHaveBeenCalled();

    // max length
    await userEvent.type(
      getByRole("textbox", {name: /app.assetTypes.form.name/i}),
      "abcdefghijklmnop"
    );
    expect(await alert()).toHaveTextContent("Field use length from 3 to 12 characters");
    expect(spy).not.toHaveBeenCalled();
  });

  test('should create new model if inputs are valid', async () => {
    const spy = jest.spyOn(mockAssetTypesStore, "create");
    const {getByRole, queryByRole} = render(<DiProvider container={container}><AssetTypeForm/></DiProvider>);
    const save = () => userEvent.click(getByRole('button', {name: /app.common.actions.save/i}));
    const alert = () => queryByRole('alert', {name: /app.common.form.alert/i});

    await userEvent.type(
      getByRole("textbox", {name: /app.assetTypes.form.name/i}),
      "validName"
    );
    await save();
    expect(await alert()).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(expect.objectContaining<Partial<IAssetTypeDto>>({
      name: "validName", isSystem: false
    }));
    expect(navigate).toHaveBeenCalledWith('..');
  });

});
