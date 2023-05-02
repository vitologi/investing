import {CurrencyRatesService} from "../currency-rates.service";
import {EmptyCurrencyRatesProvider} from "../empty-currency-rates.provider";
import {ICurrencyRatesProvider} from "../../interfaces/currency-rates.provider";
import {ICollection} from "@vitologi/local-db";
import {ICurrencyRateDto} from "../../dtos/currency-rate.dto";
import {currencyRatesCollection} from "../../../offline/currencies.db";
import {sleep} from "../../../../../shared/utils/sleep";


jest.mock("../../../offline/currencies.db", () => {
  const mockCollection = {
    find: jest.fn(),
    findOne: jest.fn(),
    deleteOne: jest.fn(),
    insertOne: jest.fn(),
    updateOne: jest.fn(),
  };

  return ({
    __esModule: true,
    currencyRatesCollection: () => mockCollection
  })
});

describe('CurrencyRatesService', () => {
  let service: CurrencyRatesService;
  let mockProvider: jest.Mocked<ICurrencyRatesProvider>;
  let mockCollection: jest.Mocked<ICollection<ICurrencyRateDto>>;
  const date = new Date('2023-05-01');
  const mockDto = {
    _id: '_id',
    base: 'USD',
    timestamp: date.getTime(),
    rates: {
      USD: 1,
      EUR: 2,
    }
  };

  beforeAll(() => {
    mockCollection = currencyRatesCollection() as jest.Mocked<ICollection<ICurrencyRateDto>>;
  })

  beforeEach(() => {
    service = new CurrencyRatesService();
    mockProvider = {
      setSecureToken: jest.fn(),
      getExchangeRates: jest.fn(),
    };
    mockCollection.findOne.mockReset();
    mockCollection.insertOne.mockReset();
  });

  test('provider (has default empty provider)', () => {
    expect(service.provider).toBeInstanceOf(EmptyCurrencyRatesProvider);
  });

  test('setProvider (should change provider)', () => {
    expect(service.provider).toBeInstanceOf(EmptyCurrencyRatesProvider);
    service.setProvider(mockProvider);
    expect(service.provider).toBe(mockProvider);
  });

  test('getExchangeRate (should check local db on stored rates)', async () => {
    mockCollection.findOne.mockResolvedValueOnce(mockDto);
    await expect(service.getExchangeRate({from: 'USD', to: 'USD', date}))
      .resolves.toBe(1);
    expect(mockCollection.findOne).toHaveBeenCalledTimes(1);
    expect(mockCollection.findOne).toHaveBeenCalledWith({timestamp: 1682884800000});
  });

  test('getExchangeRate (should request rates from provider)', async () => {
    mockCollection.findOne.mockResolvedValue(null);
    mockProvider.getExchangeRates.mockResolvedValue(mockDto);
    service.setProvider(mockProvider);

    await expect(service.getExchangeRate({from: 'USD', to: 'USD', date})).resolves.toBe(1);

    expect(mockProvider.getExchangeRates).toHaveBeenCalledTimes(1);
    expect(mockCollection.insertOne).toHaveBeenCalledWith(mockDto);
  });

  test('getExchangeRate (should use different dates)', async () => {
    const date1 = new Date('2023-05-01');
    const date2 = new Date('2023-05-02');
    mockCollection.findOne.mockResolvedValue(null);
    mockProvider.getExchangeRates.mockResolvedValue(mockDto);
    service.setProvider(mockProvider);

    await Promise.all([
      service.getExchangeRate({from: 'USD', to: 'USD', date: date1}),
      service.getExchangeRate({from: 'USD', to: 'USD', date: date2}),
    ]);

    expect(mockProvider.getExchangeRates).toHaveBeenCalledTimes(2);
    expect(mockProvider.getExchangeRates).toHaveBeenCalledWith(date1);
    expect(mockProvider.getExchangeRates).toHaveBeenCalledWith(date2);
  });

  test('getExchangeRate (should throw error if provider unavailable)', async () => {
    mockCollection.findOne.mockResolvedValue(null);
    mockProvider.getExchangeRates.mockRejectedValue(new Error());
    service.setProvider(mockProvider);

    await expect(service.getExchangeRate({from: 'USD', to: 'USD', date})).rejects.toThrowError();

    expect(mockProvider.getExchangeRates).toHaveBeenCalledTimes(1);
    expect(mockCollection.insertOne).not.toHaveBeenCalled();
  });

  test('getExchangeRate (shouldnt send multiple requests)', async () => {
    mockCollection.findOne.mockResolvedValue(null);
    mockProvider.getExchangeRates.mockResolvedValue(mockDto);

    service.setProvider(mockProvider);
    const spy = jest.fn();
    service.getExchangeRate({from: 'USD', to: 'USD', date}).then(spy);
    service.getExchangeRate({from: 'USD', to: 'USD', date}).then(spy);
    await sleep(10);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(mockProvider.getExchangeRates).toHaveBeenCalledTimes(1);
  });

  test('getExchangeRate (shouldnt put in db empty values)', async () => {
    mockCollection.findOne.mockResolvedValue(null);
    mockProvider.getExchangeRates.mockResolvedValue(null);
    service.setProvider(mockProvider);

    await expect(service.getExchangeRate({from: 'USD', to: 'USD', date})).resolves.toBe(1);

    expect(mockCollection.insertOne).not.toHaveBeenCalled();
  });
});
