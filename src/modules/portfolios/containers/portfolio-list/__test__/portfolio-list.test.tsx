import {Container} from "inversify";
import {buildIoc} from "../../../../../store/build-ioc";
import {PortfoliosStore} from "../../../store/portfolios.store";
import {PortfoliosService} from "../../../shared/services/portfolios.service";
import * as reactRouter from "react-router";
import {IntlStore} from "../../../../intl/store/intl.store";
import {render} from "../../../../../test-utils";
import {DiProvider} from "../../../../../shared/components/di/di.provider";
import {PortfolioList} from "../portfolio-list";
import {mockedPortfolioDtos} from "../../../shared/dtos/__mocks__/portfolio.dto";
import userEvent from "@testing-library/user-event";
import {waitFor} from "@testing-library/react";

jest.mock("../../../shared/services/portfolios.service");

describe('PortfolioList', () => {
  let di: Container;
  let navigate: jest.Mocked<ReturnType<typeof reactRouter.useNavigate>>;

  beforeAll(() => {
    di = buildIoc([PortfoliosStore, IntlStore, PortfoliosService]);
  });

  beforeEach(async () => {
    di.snapshot();
    navigate = jest.fn();
    jest.spyOn(reactRouter, 'useNavigate').mockReturnValue(navigate);
    const store = di.get<PortfoliosStore>(PortfoliosStore.name);
    await waitFor(()=>expect(store.isInit).toBeTruthy());
  });

  afterEach(() => {
    di.restore();
  });

  test('should render list', () => {
    const {getByRole} = render(
      <DiProvider container={di}>
        <PortfolioList/>
      </DiProvider>
    );

    expect(getByRole('list')).toBeInTheDocument();
  });

  test('should render list', async () => {
    const {getAllByRole} = render(
      <DiProvider container={di}>
        <PortfolioList/>
      </DiProvider>
    );

    expect(getAllByRole('listitem').length).toBe(mockedPortfolioDtos.length);
  })

  test('should redirect to add item page', async () => {
    const {getByTestId} = render(
      <DiProvider container={di}>
        <PortfolioList/>
      </DiProvider>
    );
    const addButton = getByTestId('AddIcon')
    expect(addButton).toBeInTheDocument();

    await userEvent.click(addButton);

    expect(navigate).toHaveBeenCalledWith('new');
  });

  test('should delete item', async () => {
    const store = di.get<PortfoliosStore>(PortfoliosStore.name);
    const intlStore = di.get<IntlStore>(IntlStore.name);
    const {getAllByRole} = render(
      <DiProvider container={di}>
        <PortfolioList/>
      </DiProvider>
    );

    expect(store.list.length).toBe(mockedPortfolioDtos.length);
    const firstDeleteButton = getAllByRole('button',{name: intlStore.formatMessage("app.common.actions.delete")})[0];
    expect(firstDeleteButton).toBeInTheDocument();
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
    const deleteSpy = jest.spyOn(store, 'delete');
    await userEvent.click(firstDeleteButton);

    expect(confirmSpy).toBeCalled()
    expect(deleteSpy).toHaveBeenCalled()
    expect(store.list.length).toBe(mockedPortfolioDtos.length-1);
  });
});
