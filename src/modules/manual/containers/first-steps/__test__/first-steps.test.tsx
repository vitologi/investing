import {Container} from "inversify";
import * as reactRouter from "react-router";
import {IntlStore} from "../../../../intl/store/intl.store";
import {ManualStore} from "../../../store/manual.store";
import {StorageService} from "../../../../../shared/services/storage.service";
import {render} from "../../../../../test-utils";
import {DiProvider} from "../../../../../shared/components/di/di.provider";
import {FirstSteps} from "../first-steps";
import {LanguageCode} from "../../../../intl/shared/enums/language-code";
import {act, waitFor} from "@testing-library/react";


jest.mock("../../../../intl/store/intl.store");
jest.mock("../../../../../shared/services/storage.service");

jest.mock('../../../components/first-steps-content/first-steps-content.ru', () => ({
  __esModule: true,
  default: ({onFinish}: { onFinish: () => void }) => {
    setTimeout(onFinish, 100);
    return (<div data-testid="first-steps-content.ru">first-steps-content.ru</div>);
  }
}));
jest.mock('../../../components/first-steps-content/first-steps-content.en', () => ({
  __esModule: true,
  default: () => (<div data-testid="first-steps-content.en">first-steps-content.en</div>)
}));

describe('FirstSteps', () => {
  let di: Container;
  let navigate: jest.Mocked<ReturnType<typeof reactRouter.useNavigate>>;
  const mockIntlStore = new IntlStore();
  const mockStorageService = new StorageService();
  const mockManualStore = new ManualStore(mockStorageService);


  beforeAll(() => {
    di = new Container();
    di.bind<IntlStore>(IntlStore.key).toConstantValue(mockIntlStore);
    di.bind<ManualStore>(ManualStore.key).toConstantValue(mockManualStore);
  })

  beforeEach(() => {
    navigate = jest.fn();
    jest.spyOn(reactRouter, 'useNavigate').mockReturnValue(navigate);
  });

  test('should render specified locale and handle finish', async () => {
    expect(mockManualStore.isInit).toBeFalsy();
    expect(navigate).not.toHaveBeenCalled();
    const {queryByTestId} = render(<DiProvider container={di}><FirstSteps/></DiProvider>);

    act(()=>mockIntlStore.setLanguage(LanguageCode.En));

    await waitFor(() => expect(queryByTestId('first-steps-content.en')).toBeInTheDocument());

    act(()=>mockIntlStore.setLanguage(LanguageCode.Ru));
    await waitFor(() => expect(queryByTestId('first-steps-content.ru')).toBeInTheDocument());

    await waitFor(()=> expect(mockManualStore.isInit).toBeTruthy());
    await waitFor(()=> expect(navigate).toHaveBeenCalled());
  });
})
