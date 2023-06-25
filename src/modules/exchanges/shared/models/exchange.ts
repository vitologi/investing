import {Model} from "../../../../shared/models/model";
import {IExchangeDto} from "../dtos/exchange.dto";
import {ExchangeStore} from "../../store/exchange.store";
import {makeObservable, observable} from "mobx";

export class Exchange extends Model<IExchangeDto, ExchangeStore>{
  // TODO: set defaults
  name = '';
  country = '';
  mic = '';
  yahooSuffix = '';

constructor(protected store: ExchangeStore, id:string) {
  super(store, id);
  makeObservable(this, {
    name: observable,
    country: observable,
    mic: observable,
    yahooSuffix: observable,
  })
}

  get asDto(): IExchangeDto {
    return {
      _id: this.id,
      name: this.name,
      country: this.country,
      mic: this.mic,
      yahooSuffix: this.yahooSuffix,
    };
  }
  dispose(): void {
  }

  updateFromDto(dto: IExchangeDto): void {
    this.name = dto.name;
    this.country = dto.country;
    this.mic = dto.mic;
    this.yahooSuffix = dto.yahooSuffix;
  }
}
