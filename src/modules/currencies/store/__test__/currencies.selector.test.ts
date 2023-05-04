import { useIocContainer } from '../../../../store/ioc.selector';
import { useCurrenciesStore } from '../currencies.selector';

jest.mock('../../../../store/ioc.selector', () => ({
  useIocContainer: jest.fn(),
}));

const mockCurrenciesStore = {};

describe('useCurrenciesStore', () => {
  beforeEach(() => {
    // Reset the mock implementation for each test
    (useIocContainer as jest.Mock).mockReturnValue({
      get: jest.fn(() => mockCurrenciesStore),
    });
  });

  test('should return an instance of CurrenciesStore', () => {
    const currenciesStore = useCurrenciesStore();
    expect(currenciesStore).toBe(mockCurrenciesStore);
  });

  test('should call the IoC container with the correct argument', () => {
    useCurrenciesStore();
    expect((useIocContainer as jest.Mock)().get).toHaveBeenCalledWith('CurrenciesStore');
  });
});
