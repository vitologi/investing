import {render} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import Dictionaries from "../dictionaries";

jest.mock("../../../../navigation/containers/titled/titled");

jest.mock(
  "../../../../asset-types/containers/asset-types/asset-types",
  ()=>({AssetTypes:()=>(<div data-testid="AssetTypes">AssetTypes</div>)})
  )
jest.mock(
  "../../../../currencies/containers/currencies/currencies",
  ()=>({Currencies:()=>(<div data-testid="Currencies">Currencies</div>)})
  )
jest.mock(
  "../../../../exchanges/containers/exchanges/exchanges",
  ()=>({Exchanges:()=>(<div data-testid="Exchanges">Exchanges</div>)})
  )
jest.mock(
  "../../../../portfolios/containers/portfolios/portfolios",
  ()=>({Portfolios:()=>(<div data-testid="Portfolios">Portfolios</div>)})
  )

describe('Dictionaries component', () => {

  test('renders AssetTypes on index route', () => {
    const {getByText} = render(<Dictionaries/>, {wrapper: MemoryRouter});
    expect(getByText('AssetTypes')).toBeInTheDocument();
  });

  test('renders Currencies', () => {
    const { getByText } = render(
      <MemoryRouter  initialEntries={['/currencies']}>
        <Dictionaries />
      </MemoryRouter >
    );

    expect(getByText('Currencies')).toBeInTheDocument();
  });

  test('renders Exchanges', () => {
    const { getByText } = render(
      <MemoryRouter  initialEntries={['/exchanges']}>
        <Dictionaries />
      </MemoryRouter >
    );

    expect(getByText('Exchanges')).toBeInTheDocument();
  });

  test('renders Portfolios', () => {
    const { getByText } = render(
      <MemoryRouter  initialEntries={['/portfolios']}>
        <Dictionaries />
      </MemoryRouter >
    );

    expect(getByText('Portfolios')).toBeInTheDocument();
  });
});
