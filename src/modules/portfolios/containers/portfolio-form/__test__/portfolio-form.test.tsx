import {Container} from "inversify";
import * as reactRouter from "react-router";
import {buildIoc} from "../../../../../store/build-ioc";
import {PortfoliosStore} from "../../../store/portfolios.store";
import {IntlStore} from "../../../../intl/store/intl.store";
import {PortfoliosService} from "../../../shared/services/portfolios.service";
import {waitFor} from "@testing-library/react";
import {render} from "../../../../../test-utils";
import {DiProvider} from "../../../../../shared/components/di/di.provider";
import {PortfolioForm} from "../portfolio-form";
import userEvent from "@testing-library/user-event";

jest.mock("../../../shared/services/portfolios.service");

describe('PortfolioForm', () => {
  let di: Container;
  let navigate: jest.Mocked<ReturnType<typeof reactRouter.useNavigate>>;

  beforeAll(() => {
    di = buildIoc([PortfoliosStore, IntlStore, PortfoliosService]);
  });

  beforeEach(async () => {
    di.snapshot();
    navigate = jest.fn();
    jest.spyOn(reactRouter, 'useNavigate').mockReturnValue(navigate);
    const store = di.get<PortfoliosStore>(PortfoliosStore.key);
    await waitFor(() => store.isInit);
  });

  afterEach(() => {
    di.restore();
  });

  test('should render all fields', () => {
    const intlStore = di.get<IntlStore>(IntlStore.key);
    const {getByRole} = render(
      <DiProvider container={di}>
        <PortfolioForm/>
      </DiProvider>
    );

    const nameField = getByRole('textbox', {name: intlStore.formatMessage("app.common.form.labels.name")});
    const descriptionField = getByRole('textbox', {name: intlStore.formatMessage("app.common.form.labels.description")});

    expect(nameField).toBeInTheDocument();
    expect(descriptionField).toBeInTheDocument();
  });

  test('should show errors if fields were not filled', async () => {
    const intlStore = di.get<IntlStore>(IntlStore.key);
    const {getByRole, queryAllByText} = render(
      <DiProvider container={di}>
        <PortfolioForm/>
      </DiProvider>
    );
    const saveButton = getByRole('button', {name: intlStore.formatMessage("app.common.actions.save")});

    expect(saveButton).toBeInTheDocument();
    expect(queryAllByText(intlStore.formatMessage("app.common.form.rules.required")).length).toBe(0);

    await userEvent.click(saveButton);
    await waitFor(()=>expect(queryAllByText(intlStore.formatMessage("app.common.form.rules.required")).length).toBe(2));
  });

  test('should add new item', async () => {
    const intlStore = di.get<IntlStore>(IntlStore.key);
    const store = di.get<PortfoliosStore>(PortfoliosStore.key);
    await waitFor(()=>expect(store.isInit).toBeTruthy());
    const len = store.list.length;

    const {getByRole} = render(
      <DiProvider container={di}>
        <PortfolioForm/>
      </DiProvider>
    );

    expect(store.list.length).toBe(len);

    const nameField = getByRole('textbox', {name: intlStore.formatMessage("app.common.form.labels.name")});
    const descriptionField = getByRole('textbox', {name: intlStore.formatMessage("app.common.form.labels.description")});
    const saveButton = getByRole('button', {name: intlStore.formatMessage("app.common.actions.save")});

    await userEvent.type(nameField, 'name');
    await userEvent.type(descriptionField, 'description');
    await userEvent.click(saveButton);

    await waitFor(()=>expect(store.list.length).toBe(len+1));
    expect(navigate).toHaveBeenCalled();
  });


});
