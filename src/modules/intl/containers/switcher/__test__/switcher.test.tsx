import {render} from "../../../../../test-utils";
import userEvent from "@testing-library/user-event";
import * as intlSelector from "../../../store/intl.selector";
import {IntlStore} from "../../../store/intl.store";
import {LanguageSwitcher} from "../switcher";

jest.mock("../../../store/intl.selector", ()=>({
  __esModule: true,
  useIntlStore: jest.fn(),
}))

describe('SelectSwitcher', ()=>{
  let store: jest.Mocked<IntlStore>;

  beforeEach(()=>{
    store = {
      switchToEnglish: jest.fn(),
      switchToRussian: jest.fn(),
    } as unknown as jest.Mocked<IntlStore>;

    (intlSelector as jest.Mocked<typeof import("../../../store/intl.selector")>)
      .useIntlStore.mockReturnValue(store);
  })

  test('should be rendered', async ()=>{
    const {getByRole} = render(<LanguageSwitcher />);
    expect(getByRole('list')).toBeInTheDocument();
  });

  test('should contains two button', async ()=>{
    const {getAllByRole} = render(<LanguageSwitcher />);
    expect(getAllByRole('button').length).toBe(2);
  });

  test('should switch language', async ()=>{
    const {getByRole} = render(<LanguageSwitcher />);
    const ruButton = getByRole('button', {name: /Русский/i});
    const enButton = getByRole('button', {name: /English/i});
    await userEvent.click(ruButton);
    await userEvent.click(enButton);
    expect(store.switchToEnglish).toHaveBeenCalledTimes(1);
    expect(store.switchToRussian).toHaveBeenCalledTimes(1);
  });
})
