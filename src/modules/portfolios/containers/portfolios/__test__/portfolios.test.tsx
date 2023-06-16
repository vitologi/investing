import {render} from "../../../../../test-utils";
import {MemoryRouter} from "react-router-dom";
import {Portfolios} from "../portfolios";

jest.mock("../../portfolio-list/portfolio-list",()=>({
  __esModules: true,
  PortfolioList: ()=>(<div data-testid="PortfolioList">PortfolioList</div>)
}));

jest.mock("../../portfolio-form/portfolio-form",()=>({
  __esModules: true,
  PortfolioForm: ()=>(<div data-testid="PortfolioForm">PortfolioForm</div>)
}));

jest.mock("../../../../../shared/components/not-found/not-found",()=>({
  __esModules: true,
  NotFound: ()=>(<div data-testid="NotFound">NotFound</div>)
}));

jest.mock("../../../../navigation/containers/titled/titled");


describe('Portfolios', ()=>{


  test('should show list page by default', ()=>{
    const {getByTestId} = render(
      <MemoryRouter initialEntries={['/']}>
        <Portfolios/>
      </MemoryRouter>
    );

    expect(getByTestId('PortfolioList')).toBeInTheDocument();
  });

  test('should show edit page', ()=>{
    const {getByTestId} = render(
      <MemoryRouter initialEntries={['/new/some-id']}>
        <Portfolios/>
      </MemoryRouter>
    );

    expect(getByTestId('PortfolioForm')).toBeInTheDocument();
  });

  test('should show not found if route is incorrect', ()=>{
    const {getByTestId} = render(
      <MemoryRouter initialEntries={['/UNKNOWN_ROUTE']}>
        <Portfolios/>
      </MemoryRouter>
    );

    expect(getByTestId('NotFound')).toBeInTheDocument();
  });
})
