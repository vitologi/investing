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

jest.mock("../../../shared/services/portfolios.service");

describe('PortfolioList', () => {
  let di: Container;
  let navigate: jest.Mocked<ReturnType<typeof reactRouter.useNavigate>>;

  beforeAll(() => {
    di = buildIoc([PortfoliosStore, IntlStore, PortfoliosService]);
  });

  beforeEach(() => {
    di.snapshot();
    navigate = jest.fn();
    jest.spyOn(reactRouter, 'useNavigate').mockReturnValue(navigate);
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
    const store = di.get<PortfoliosStore>(PortfoliosStore.name);
    const service = di.get<PortfoliosService>(PortfoliosService.name);
    jest.spyOn(service, 'list').mockResolvedValue(mockedPortfolioDtos);
    await store.load();

    const {getAllByRole} = render(
      <DiProvider container={di}>
        <PortfolioList/>
      </DiProvider>
    );

    expect(getAllByRole('listitem').length).toBe(mockedPortfolioDtos.length);
  })

});
