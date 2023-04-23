import {render} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {AssetTypes} from "../asset-types";

jest.mock("../../../../navigation/containers/titled/titled");
jest.mock(
  "../../asset-type-list/asset-type-list",
  () => ({AssetTypeList: () => (<div data-testid="asset-type-list">asset-type-list</div>)})
);
jest.mock(
  "../../asset-type-form/asset-type-form",
  () => ({AssetTypeForm: () => (<div data-testid="asset-type-form">asset-type-form</div>)}),
);
jest.mock(
  "../../../../../shared/components/not-found/not-found",
  () => ({NotFound: () => (<div data-testid="not-found">not-found</div>)}),
);

describe('AssetTypes component', () => {

  test('renders AssetTypeList on index route', () => {
    const {getByText} = render(<AssetTypes/>, {wrapper: MemoryRouter});
    expect(getByText('asset-type-list')).toBeInTheDocument();
  });

  test('renders AssetTypeForm on new route', () => {
    const { getByText } = render(
      <MemoryRouter  initialEntries={['/new']}>
        <AssetTypes />
      </MemoryRouter >
    );

    expect(getByText('asset-type-form')).toBeInTheDocument();
  });

  test('renders NotFound on invalid route', () => {
    const { getByText } = render(
      <MemoryRouter  initialEntries={['/invalid']}>
        <AssetTypes />
      </MemoryRouter >
    );

    expect(getByText('not-found')).toBeInTheDocument();
  });
});
