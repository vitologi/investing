import {CurrencyRatesService} from "../currency-rates.service";
import {EmptyCurrencyRatesProvider} from "../empty-currency-rates.provider";
import {ICurrencyRatesProvider} from "../../interfaces/currency-rates.provider";
import {ICollection} from "@vitologi/local-db";
import {ICurrencyRateDto} from "../../dtos/currency-rate.dto";
import {currencyRatesCollection} from "../../../offline/currencies.db";


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
      USD: 1
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

  test('created', () => {
    expect(service).toBeTruthy();
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
    mockProvider.getExchangeRates.mockResolvedValueOnce(mockDto);
    mockCollection.insertOne.mockResolvedValueOnce({
      insertedCount: 1,
      insertedIds: {[0]: '_id'}
    });
    mockCollection.findOne
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(mockDto);

    service.setProvider(mockProvider);

    await expect(service.getExchangeRate({from: 'USD', to: 'USD', date}))
      .resolves
      .toBe(1);

    expect(mockProvider.getExchangeRates).toHaveBeenCalledTimes(1);
    expect(mockProvider.getExchangeRates).toHaveBeenCalledWith(date);

    expect(mockCollection.insertOne).toHaveBeenCalledTimes(1);
    expect(mockCollection.insertOne).toHaveBeenCalledWith(mockDto);

    expect(mockCollection.findOne).toHaveBeenCalledTimes(2);
  });

  test('getExchangeRate (shouldnt send multiple requests for one date)', async () => {
    mockProvider.getExchangeRates.mockResolvedValue(mockDto);
    mockCollection.insertOne.mockResolvedValue({
      insertedCount: 1,
      insertedIds: {[0]: '_id'}
    });
    mockCollection.findOne
      .mockResolvedValueOnce(null)
      .mockResolvedValue(mockDto);

    service.setProvider(mockProvider);

    const send = ()=> expect(service.getExchangeRate({from: 'USD', to: 'USD', date}))
      .resolves
      .toBe(1);

    await send();
    await send();

    expect(mockProvider.getExchangeRates).toHaveBeenCalledTimes(1);
    expect(mockCollection.insertOne).toHaveBeenCalledTimes(1);
  });

  test('getExchangeRate (should resend request if previous was failed)', async () => {
    let isDtoPut = false;
    mockProvider.getExchangeRates
      .mockRejectedValueOnce(new Error())
      .mockResolvedValue(mockDto);
    mockCollection.insertOne.mockImplementation(async () => {
      isDtoPut = true;
      return {
        insertedCount: 1,
        insertedIds: {[0]: '_id'}
      }
    });

    mockCollection.findOne.mockImplementation(async ()=> isDtoPut ? mockDto : null);

    service.setProvider(mockProvider);

    await expect(service.getExchangeRate({from: 'USD', to: 'USD', date}))
      .rejects
      .toThrowError();

    await expect(service.getExchangeRate({from: 'USD', to: 'USD', date}))
      .resolves
      .toBe(1);

    expect(mockProvider.getExchangeRates).toHaveBeenCalledTimes(2);
    expect(mockCollection.insertOne).toHaveBeenCalledTimes(1);
  });

  // TODO: refactor method and write tests
});
