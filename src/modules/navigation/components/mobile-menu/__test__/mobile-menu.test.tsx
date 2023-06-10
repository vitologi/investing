import {render} from "../../../../../test-utils";
import {MemoryRouter, Route, Routes} from "react-router-dom";
import {MobileMenu} from "../mobile-menu";
import {fireEvent} from "@testing-library/react";

describe('MobileMenu',()=>{
  const mockProps = {
    id: 'menu',
    isOpen: true,
    label: 'Menu',
    anchorElement: document.createElement('div'),
    closeHandler: jest.fn(),
  };

  test('renders the menu with correct props', () => {
    const {getByRole} = render(<MemoryRouter><MobileMenu {...mockProps} /></MemoryRouter>);

    const menu = getByRole('presentation');
    expect(menu).toBeInTheDocument();
    expect(menu).toHaveAttribute('id', mockProps.id);
    expect(menu).toHaveAttribute('aria-label', mockProps.label);
    expect(menu).toHaveAttribute('aria-expanded', 'true');
  });

  // test('calls the closeHandler when menu is closed', async () => {
  //   const spy = jest.fn();
  //   const {getByRole} = render(
  //     <MemoryRouter>
  //       <MobileMenu {...mockProps} closeHandler={spy}/>
  //     </MemoryRouter>
  //   );
  //
  //   const menu = getByRole('presentation');
  //   const parent = menu.closest('body');
  //   expect(parent).toBeInTheDocument();
  //   console.log(parent)
  //   await userEvent.click(parent as HTMLElement);
  //   expect(spy).toHaveBeenCalledTimes(1);
  // });

  // TODO: change to localization keys
  test('renders the profile menu item with correct props and navigates to /profile', () => {
    const {getByRole, getByTestId} = render(
      <MemoryRouter>
        <Routes>
          <Route index={true} element={<MobileMenu {...mockProps} />}/>
          <Route path={'/profile'} element={<div data-testid={'profile-page'}>profile-page</div>}/>
        </Routes>
      </MemoryRouter>
    );

    const profileMenuItem = getByRole('menuitem');
    expect(profileMenuItem).toBeInTheDocument();

    fireEvent.click(profileMenuItem);
    expect(getByTestId('profile-page')).toBeInTheDocument();
  });
})
