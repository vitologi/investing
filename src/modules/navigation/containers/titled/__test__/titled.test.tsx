import {Container} from "inversify";
import {buildIoc} from "../../../../../store/build-ioc";
import {NavigationPanelStore} from "../../../store/navigation-panel.store";
import {render} from "../../../../../test-utils";
import {DiProvider} from "../../../../../shared/components/di/di.provider";
import {DrawersPanelStore} from "../../../store/drawers-panel.store";
import {Titled} from "../titled";
import {MemoryRouter, Route, Routes} from "react-router-dom";
import {waitFor} from "@testing-library/react";

describe('Titled', () => {
  let di: Container;

  beforeAll(() => {
    di = buildIoc([NavigationPanelStore, DrawersPanelStore]);
  })

  test('should render children', () => {
    const {getByTestId} = render(
      <MemoryRouter initialEntries={['/']}>
        <DiProvider container={di}>
          <Titled title={"app.titles.main"}>
            <div data-testid="test">test</div>
          </Titled>
        </DiProvider>
      </MemoryRouter>
    );

    expect(getByTestId("test")).toBeInTheDocument();
  });

  test('should set title and current location path to store', async () => {
    const store = di.get<NavigationPanelStore>(NavigationPanelStore.key);

    // check on defaults
    expect(store.title).toBe('app.titles.main');
    expect(store.path).toBe('/');

    const {getByTestId} = render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <DiProvider container={di}>
          <Routes>
            <Route path={"/dashboard"} element={
              <Titled title={"app.titles.dashboard"}>
                <div data-testid="test">test</div>
              </Titled>
            } />
          </Routes>
        </DiProvider>
      </MemoryRouter>
    );
    expect(getByTestId("test")).toBeInTheDocument();
    expect(store.title).toBe("app.titles.dashboard");
    await waitFor(()=> expect(store.path).toBe('/dashboard'));
  });
});
