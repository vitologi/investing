import {Container} from "inversify";
import {buildIoc} from "../../../../../store/build-ioc";
import {DrawersPanelStore} from "../../../store/drawers-panel.store";
import {NavigationPanelStore} from "../../../store/navigation-panel.store";
import {fireEvent, render} from "@testing-library/react";
import {DiProvider} from "../../../../../shared/components/di/di.provider";
import {NavigationPanel} from "../navigation-panel";
import {MemoryRouter, Route, Routes} from "react-router-dom";
import {IntlStore} from "../../../../intl/store/intl.store";

describe('NavigationPanel', () => {
  let di: Container;

  beforeAll(() => {
    di = buildIoc([IntlStore, DrawersPanelStore, NavigationPanelStore]);
  });

  beforeEach(() => {
    di.snapshot();
  });

  afterEach(() => {
    di.restore();
  });

  test('should render properly', () => {
    const {getByRole} = render(
      <MemoryRouter>
        <DiProvider container={di}>
          <NavigationPanel/>
        </DiProvider>
      </MemoryRouter>
    );

    expect(getByRole('banner')).toBeInTheDocument();
  });

  test('should open drawer panel', () => {
    const intlStore = di.get<IntlStore>(IntlStore.name);
    const drawerPanelStore = di.get<DrawersPanelStore>(DrawersPanelStore.name);
    const {getByRole} = render(
      <MemoryRouter>
        <DiProvider container={di}>
          <NavigationPanel/>
        </DiProvider>
      </MemoryRouter>
    );

    const toggleDrawerPanelButton = getByRole('button', {name: intlStore.formatMessage("app.navigation.drawersToggle.title")});

    fireEvent.click(toggleDrawerPanelButton);
    expect(drawerPanelStore.isOpen).toBeTruthy();
    fireEvent.click(toggleDrawerPanelButton);
    expect(drawerPanelStore.isOpen).toBeFalsy();
  });

  test('should go to profile page', () => {
    const intlStore = di.get<IntlStore>(IntlStore.name);
    const {getByRole, getByTestId} = render(
      <DiProvider container={di}>
        <MemoryRouter>
          <Routes>
            <Route index={true} element={<NavigationPanel/>}/>
            <Route path={'/profile'} element={<div data-testid="fake-profile">fake-profile</div>}/>
          </Routes>
        </MemoryRouter>
      </DiProvider>
    );

    const goToProfileLink = getByRole(
      'button',
      {name: intlStore.formatMessage("app.navigation.navigationPanel.profileLink.label")}
    );

    fireEvent.click(goToProfileLink);
    expect(getByTestId('fake-profile')).toBeInTheDocument();
  });

  test('should open mobile menu', () => {
    const intlStore = di.get<IntlStore>(IntlStore.name);

    const {getByRole, queryByRole} = render(
      <DiProvider container={di}>
        <MemoryRouter>
          <NavigationPanel/>
        </MemoryRouter>
      </DiProvider>
    );

    const goToProfileLink = getByRole(
      'button',
      {name: intlStore.formatMessage("app.navigation.navigationPanel.showMore.label")}
    );

    expect(queryByRole(
      'presentation',
      {name:intlStore.formatMessage("app.navigation.navigationPanel.showMoreMenu.label")})
    ).toBeNull();

    fireEvent.click(goToProfileLink);
    expect(getByRole(
      'presentation',
      {name:intlStore.formatMessage("app.navigation.navigationPanel.showMoreMenu.label")})
    ).toBeVisible();

  });
});
