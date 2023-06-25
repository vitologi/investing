import {render} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {Manual} from "../manual";

jest.mock("../../../../navigation/containers/titled/titled");
jest.mock(
  "../../first-steps/first-steps",
  () => ({FirstSteps: () => (<div data-testid="first-steps">first-steps</div>)})
);
jest.mock(
  "../../demo-dialog/demo-dialog",
  () => ({DemoDialog: () => (<div data-testid="demo-dialog">demo-dialog</div>)})
);

describe('Manual component', () => {

  test('renders FirstSteps on index route', () => {
    const {getByText} = render(<Manual/>, {wrapper: MemoryRouter});
    expect(getByText('first-steps')).toBeInTheDocument();
    expect(getByText('demo-dialog')).toBeInTheDocument();
  });

  test('renders FirstSteps in any cases', () => {
    const { getByText } = render(
      <MemoryRouter  initialEntries={['/UNDEFINED_ROUTE']}>
        <Manual />
      </MemoryRouter >
    );

    expect(getByText('first-steps')).toBeInTheDocument();
  });
});
