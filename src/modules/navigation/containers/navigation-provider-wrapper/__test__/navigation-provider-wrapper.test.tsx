import enLocale from '../../../../intl/locale/en.json';
import {NavigationProviderWrapper} from "../navigation-provider-wrapper";
import {render} from "../../../../../test-utils";
import {Container} from "inversify";
import {buildIoc} from "../../../../../store/build-ioc";
import {IntlStore} from "../../../../intl/store/intl.store";
import {NavigationPanelStore} from "../../../store/navigation-panel.store";
import {DrawersPanelStore} from "../../../store/drawers-panel.store";
import {DiProvider} from "../../../../../shared/components/di/di.provider";
import {waitFor} from "@testing-library/react";


describe('NavigationProviderWrapper', () => {
  let di: Container;

  beforeAll(() => {
    di = buildIoc([IntlStore, NavigationPanelStore, DrawersPanelStore]);
  })

  test('renders children and sets the document title', async () => {
    const children = <div>Test Children</div>;
    const store = di.get<NavigationPanelStore>(NavigationPanelStore.name);
    const title = store.title = "app.titles.main";

    const {getByText} = render(
      <DiProvider container={di}>
        <NavigationProviderWrapper>{children}</NavigationProviderWrapper>
      </DiProvider>
    );

    // Verify that the children are rendered
    expect(getByText('Test Children')).toBeInTheDocument();

    // Verify that the document title is set correctly
    await waitFor(()=>expect(global.window.document.title).toEqual(enLocale[title]));
  });
});
