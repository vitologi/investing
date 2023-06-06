import {DrawersPanel} from "../drawers-panel";
import {Container} from "inversify";
import {buildIoc} from "../../../../../store/build-ioc";
import {DrawersPanelStore} from "../../../store/drawers-panel.store";
import {NavigationPanelStore} from "../../../store/navigation-panel.store";
import {render} from "../../../../../test-utils";
import {DiProvider} from "../../../../../shared/components/di/di.provider";
import {MemoryRouter} from "react-router-dom";
import {IntlStore} from "../../../../intl/store/intl.store";

describe('DrawersPanel', () => {
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

  test('should be closed by default', () => {
    const {queryByRole} = render(<MemoryRouter><DiProvider container={di}><DrawersPanel/></DiProvider></MemoryRouter>);

    expect(queryByRole('list')).toBeNull();
  });

  test('should be visible if active', () => {
    const store = di.get(DrawersPanelStore.name) as DrawersPanelStore;
    store.toggleOpen();
    const {getByRole} = render(<MemoryRouter><DiProvider container={di}><DrawersPanel/></DiProvider></MemoryRouter>);

    expect(getByRole('list')).toBeInTheDocument();
  });

  test('should contains dictionaries menu', async () => {
    const store = di.get<DrawersPanelStore>(DrawersPanelStore.name);
    const intlStore = di.get<IntlStore>(IntlStore.name);
    const navStore = di.get<NavigationPanelStore>(NavigationPanelStore.name);
    store.toggleOpen();
    navStore.setPath('/dictionaries');
    const {getByText} = render(
      <MemoryRouter>
        <DiProvider container={di}><DrawersPanel/></DiProvider>
      </MemoryRouter>
    );

    expect(getByText(intlStore.formatMessage("app.titles.assetTypes"))).toBeInTheDocument()

  });

  test('should contains settings menu', async () => {
    const store = di.get<DrawersPanelStore>(DrawersPanelStore.name);
    const intlStore = di.get<IntlStore>(IntlStore.name);
    const navStore = di.get<NavigationPanelStore>(NavigationPanelStore.name);
    store.toggleOpen();
    navStore.setPath('/settings');
    const {getByText} = render(
      <MemoryRouter>
        <DiProvider container={di}><DrawersPanel/></DiProvider>
      </MemoryRouter>
    );

    expect(getByText(intlStore.formatMessage("app.settings.titles.common"))).toBeInTheDocument();

  });
});
