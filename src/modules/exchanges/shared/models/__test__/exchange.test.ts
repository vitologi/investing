import {Exchange} from "../exchange";
import {ExchangeStore} from "../../../store/exchange.store";
import {IntlStore} from "../../../../intl/store/intl.store";
import {StorageService} from "../../../../../shared/services/storage.service";
import {ExchangeService} from "../../services/exchange.service";

jest.mock("../../services/exchange.service");
jest.mock("../../../../intl/store/intl.store");
jest.mock("../../../../../shared/services/storage.service");

describe('Exchange', ()=>{
  let store: jest.Mocked<ExchangeStore>;
  const emptyDto = {"_id": "id", "country": "", "mic": "", "name": "", "yahooSuffix": ""};

  beforeEach(()=>{
    store = new ExchangeStore(
      new ExchangeService(),
      new IntlStore(),
      new StorageService(),
    ) as jest.Mocked<ExchangeStore>;
  });

  test('created', ()=>{
    const model = new Exchange(store, 'id');
    expect(model.asDto).toEqual(emptyDto);
  });

  test('updateFromDto', ()=>{
    const model = new Exchange(store, 'id');
    const newDto = {"_id": "id", "country": "country", "mic": "mic", "name": "name", "yahooSuffix": "yahooSuffix"};
    model.updateFromDto(newDto);
    expect(model.asDto).toEqual(newDto);
  });

  test('dispose (should do nothing)', ()=>{
    const model = new Exchange(store, 'id');
    model.dispose();
    expect(model.asDto).toEqual(emptyDto);
  });
})

// export class ExchangeTest extends Model<IExchangeDto, ExchangeStore>{
//   // TODO: set defaults
//   name = '';
//   country = '';
//   mic = '';
//   yahooSuffix = '';
//
// constructor(protected store: ExchangeStore, id:string) {
//   super(store, id);
//   makeObservable(this, {
//     name: observable,
//     country: observable,
//     mic: observable,
//     yahooSuffix: observable,
//   })
// }
//
//   get asDto(): IExchangeDto {
//     return {
//       _id: this.id,
//       name: this.name,
//       country: this.country,
//       mic: this.mic,
//       yahooSuffix: this.yahooSuffix,
//     };
//   }
//   dispose(): void {
//   }
//
//   updateFromDto(dto: IExchangeDto): void {
//     this.name = dto.name;
//     this.country = dto.country;
//     this.mic = dto.mic;
//     this.yahooSuffix = dto.yahooSuffix;
//   }
// }
