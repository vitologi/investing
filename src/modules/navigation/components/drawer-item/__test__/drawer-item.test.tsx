import userEvent from '@testing-library/user-event';
import {DrawerItem} from "../drawer-item";
import {MemoryRouter, Route, Routes} from "react-router-dom";
import {render} from "../../../../../test-utils";
import enTranslation from "../../../../intl/locale/en.json";


describe('DrawerItem', () => {
  test('renders the item with the correct text', () => {
    const name = 'app.titles.main';
    const url = '/home';

    const {getByText} = render(<MemoryRouter><DrawerItem name={name} url={url}/></MemoryRouter>);
    expect(getByText(enTranslation[name])).toBeInTheDocument();
  });

  test('renders the item with the correct URL', () => {
    const name = 'app.titles.main';
    const url = '/home';

    const {getByRole} = render(<MemoryRouter><DrawerItem name={name} url={url}/></MemoryRouter>);
    expect(getByRole('link')).toHaveAttribute('href', url);
  });

  test('renders the item with children', () => {
    const name = 'app.titles.main';
    const url = '/home';
    const childrenText = 'Child';

    const {getByText} = render(
      <MemoryRouter>
        <DrawerItem name={name} url={url}>
          {childrenText}
        </DrawerItem>
      </MemoryRouter>
    );

    expect(getByText(childrenText)).toBeInTheDocument();
  });

  test('does not render children when not provided', () => {
    const name = 'app.titles.main';
    const url = '/home';

    const {queryByRole} = render(
      <MemoryRouter>
        <DrawerItem name={name} url={url}/>
      </MemoryRouter>
    );
    expect(queryByRole('listitemicon')).toBeNull();
  });

  test('navigates to the correct URL when clicked', async () => {
    const name = 'app.titles.main';
    const url = '/home';

    const {getByRole, getByTestId} = render(
      <MemoryRouter>
        <Routes>
          <Route index={true} element={<DrawerItem name={name} url={url}/>}/>
          <Route path={url} element={<div data-testid="test-page">test-page</div>}/>
        </Routes>
      </MemoryRouter>
    );

    const linkElement = getByRole('link');
    expect(linkElement).toHaveAttribute('href', url);

    await userEvent.click(linkElement);
    expect(getByTestId('test-page')).toBeInTheDocument();
  });
});
