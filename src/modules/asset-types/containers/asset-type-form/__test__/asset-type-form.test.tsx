import * as reactRouter from "react-router";
import {clearTimers} from "mobx-react-lite";
import {cleanup, render} from "../../../../../test-utils";
import {Container} from "inversify";
import {AssetTypesStore} from "../../../store/asset-types.store";
import {IntlStore} from "../../../../intl/store/intl.store";
import {DiProvider} from "../../../../../shared/components/di/di.provider";
import {AssetTypesService} from "../../../shared/services/asset-types.service";
import {AssetTypeForm} from "../asset-type-form";
// import userEvent from "@testing-library/user-event";
import {fireEvent} from "@testing-library/react";

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
    const save = () => fireEvent.submit(getByRole('button', {name: /app.common.actions.save/i}));


    // empty value
    save();
    expect(await findByRole('alert', {name: /app.common.form.alert/i})).toHaveTextContent("Field is required");
    expect(spy).not.toHaveBeenCalled();


    // console.log(getByRole("textbox", {name: /app.assetTypes.form.name/i}))
    // // min length
    // fireEvent.input(
    //   getByRole("textbox", {name: /app.assetTypes.form.name/i}),
    //   {
    //     target: {
    //       value: "AA"
    //     }
    //   });
    // save();
    // expect(await findByRole('alert', {name: /app.common.form.alert/i})).toHaveTextContent("Fiel8d is required");
    // expect(spy).not.toHaveBeenCalled();


  });

  // test('should create new model and redirect to top after submit', async () => {
  //   // let start = performance.now();
  //   const spy = jest.spyOn(mockAssetTypesStore, "create");
  //   const {getByRole} = render(<DiProvider container={container}><AssetTypeForm/></DiProvider>);
  //   // expect(await findByTestId('submitButton')).toBeInTheDocument();
  //   // let point = performance.now();
  //   // console.log(`render time: ${point-start} ms`)
  //   // start = performance.now();
  //   expect(navigate).toHaveBeenCalledTimes(0);
  //   expect(spy).toHaveBeenCalledTimes(0);
  //   // mockAssetTypesStore.create({_id:'sdf', name:'sdf',isSystem:false});
  //   // expect(spy).toHaveBeenCalledTimes(1);
  //   await userEvent.click(getByRole('button', {name: /app.common.actions.save/i}));
  //   // point = performance.now();
  //   // console.log(`click time: ${point-start} ms`)
  //   // start = performance.now();
  //   // await waitFor(
  //   //   ()=>{
  //   //     expect(spy).toHaveBeenCalledTimes(1);
  //   //   },
  //   //   {timeout:4000}
  //   // );
  //   // point = performance.now();
  //   // console.log(`waitFor time: ${point-start} ms`)
  //   // start = performance.now();
  //   expect(spy).toHaveBeenCalledTimes(0);
  //   // expect(navigate).toHaveBeenCalledTimes(1);
  //   // expect(navigate).toHaveBeenCalledWith('..');
  //   // point = performance.now();
  //   // console.log(`end time: ${point-start} ms`)
  // });

});
