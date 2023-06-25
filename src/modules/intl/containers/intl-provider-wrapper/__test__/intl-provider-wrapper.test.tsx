import {FormattedMessage} from "react-intl";
import {render} from "../../../../../test-utils";
import * as intlSelector from "../../../store/intl.selector";
import {IntlStore} from "../../../store/intl.store";
import {LanguageCode} from "../../../shared/enums/language-code";
import {IntlProviderWrapper} from "../intl-provider-wrapper";


jest.mock("../../../store/intl.selector", ()=>({
  __esModule: true,
  useIntlStore: jest.fn(),
}))

describe('SelectSwitcher', ()=>{
  let mockStore: jest.Mocked<IntlStore>;

  beforeEach(()=>{
    mockStore = {
      locale: LanguageCode.Ru,
      appLocale: {test: 'test_text'},
    } as unknown as jest.Mocked<IntlStore>;

    (intlSelector as jest.Mocked<typeof import("../../../store/intl.selector")>)
      .useIntlStore.mockReturnValue(mockStore);
  })

  test('should be rendered', async ()=>{
    const {getByTestId} = render(
      <IntlProviderWrapper>
        <div data-testid="test">test</div>
      </IntlProviderWrapper>
    );
    expect(getByTestId('test')).toBeInTheDocument();
  });

  test('should render different languages', async ()=> {
    const {getByText} = render(
      <IntlProviderWrapper>
        <FormattedMessage id="test" />
      </IntlProviderWrapper>
    );
    expect(getByText('test_text')).toBeInTheDocument();
  });
})
