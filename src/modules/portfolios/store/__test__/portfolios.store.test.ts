import {PortfoliosService} from "../../shared/services/portfolios.service";
import {PortfoliosStore} from "../portfolios.store";
import {mockedPortfolioDtos} from "../../shared/dtos/__mocks__/portfolio.dto";

jest.mock("../../shared/services/portfolios.service");

describe('PortfoliosStore', ()=>{
  let service: PortfoliosService;

  beforeEach(()=>{
    service = new PortfoliosService();
  });

  test('should create empty model', ()=>{
    const store = new PortfoliosStore(service);
    const model = store.createEmpty();

    expect(model.asDto).toEqual(expect.objectContaining({
      name: '-',
      description: '-',
    }));
  });

  test('should get portfolio name by id', async ()=>{
    const store = new PortfoliosStore(service);
    await store.load();

    expect(store.list.length).toBe(mockedPortfolioDtos.length);

    const {_id, name} = mockedPortfolioDtos[0];

    expect(store.name(_id)).toBe(name);
    expect(store.name('UNKNOWN_ID')).toBe('-');
  });


})
