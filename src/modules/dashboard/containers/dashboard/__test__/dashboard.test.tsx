import {DiProvider} from "../../../../../shared/components/di/di.provider";
import {Container} from "inversify";
import {IntlStore} from "../../../../intl/store/intl.store";
import Dashboard from "../dashboard";
import {render} from "../../../../../test-utils";

jest.mock('../../../../intl/store/intl.store');

jest.mock(
  "../../../../tickers/containers/tickers-table/tickers-table",
  () => ({
    __esModule: true,
    TickersTable: ()=>(<>TickersTable</>)
  })
)

describe('Dashboard', () => {
  let di: Container;

  beforeAll(() => {
    di = new Container();
    di.bind('IntlStore').toConstantValue(new IntlStore());
  })

  test('should be rendered', () => {
    const {queryByText} = render(<DiProvider container={di}><Dashboard/></DiProvider>);
    expect(queryByText('TickersTable')).toBeTruthy();
  })

});
