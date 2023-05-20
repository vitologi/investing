import {render} from "../../../../../test-utils";
import {SelectSwitcher} from "../select-switcher";
import userEvent from "@testing-library/user-event";
import {LanguageCode} from "../../../shared/enums/language-code";

jest.mock("")

describe('SelectSwitcher', ()=>{
  // let store: jest.Mocked<Intl>
  //
  // beforeEach(()=>{
  //
  // })

  test('should be rendered', async ()=>{
    const {getByRole} = render(<SelectSwitcher />);
    expect(getByRole('button')).toBeInTheDocument();
  });

  test('should have all possible language to switch', async ()=>{
    const {getByRole,getAllByRole} = render(<SelectSwitcher />);
    await userEvent.click(getByRole('button'));
    expect(getAllByRole('option').length).toBe(Object.values(LanguageCode).length);
  });

  // test('should switch language', async ()=>{
  //   const {getByRole,getAllByRole} = render(<SelectSwitcher />);
  //   await userEvent.click(getByRole('button'));
  //   const ruButton = getByRole('option', {name: /ru/i});
  //   await userEvent.click(ruButton);
  // });
})
