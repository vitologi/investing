import {render} from "../../../../../test-utils";
import {SelectSwitcher} from "../select-switcher";
import userEvent from "@testing-library/user-event";
import {LanguageCode} from "../../../shared/enums/language-code";
import * as intlSelector from "../../../store/intl.selector";
import {IntlStore} from "../../../store/intl.store";

jest.mock("../../../store/intl.selector", ()=>({
  __esModule: true,
  useIntlStore: jest.fn(),
}))

describe('SelectSwitcher', ()=>{
  let store: jest.Mocked<IntlStore>;

  beforeEach(()=>{
    store = {
      locale: LanguageCode.En,
      setLanguage: jest.fn(),
    } as unknown as jest.Mocked<IntlStore>;

    (intlSelector as jest.Mocked<typeof import("../../../store/intl.selector")>)
      .useIntlStore.mockReturnValue(store);
  })

  test('should be rendered', async ()=>{
    const {getByRole} = render(<SelectSwitcher />);
    expect(getByRole('button')).toBeInTheDocument();
  });

  test('should have all possible language to switch', async ()=>{
    const {getByRole,getAllByRole} = render(<SelectSwitcher />);
    await userEvent.click(getByRole('button'));
    expect(getAllByRole('option').length).toBe(Object.values(LanguageCode).length);
  });

  test('should switch language', async ()=>{
    const {getByRole} = render(<SelectSwitcher />);
    await userEvent.click(getByRole('button'));
    const ruButton = getByRole('option', {name: /ru/i});
    expect(store.setLanguage).toHaveBeenCalledTimes(0);
    await userEvent.click(ruButton);
    expect(store.setLanguage).toHaveBeenCalledTimes(1);
  });
})
