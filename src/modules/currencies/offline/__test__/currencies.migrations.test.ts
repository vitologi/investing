import {IDb} from "@vitologi/local-db";
import {currenciesMigrations} from "../currencies.migrations";

describe("currencies.migrations", () => {
  let mockDb: jest.Mocked<IDb>;

  beforeAll(async ()=>{
    mockDb = {
      createCollection: jest.fn().mockResolvedValue(void 0),
      dropCollection: jest.fn().mockResolvedValue(void 0),
    } as unknown as jest.Mocked<IDb>;
  });

  test('up', async ()=>{
    await currenciesMigrations[0].up(mockDb);
    expect(mockDb.createCollection).toHaveBeenCalledWith('currencyRates', {keyPath: '_id'});
  });

  test('down', async ()=>{
    await currenciesMigrations[0].down(mockDb);
    expect(mockDb.dropCollection).toHaveBeenCalledWith('currencyRates');
  });

});
