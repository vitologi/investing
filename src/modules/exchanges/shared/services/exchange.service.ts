import {IExchangeDto} from "../interfaces/exchange.dto";
import {BaseApiService} from "../../../../shared/interfaces/base-api.service";
import {LanguageCode} from "../../../intl/shared/enums/language-code";

export class ExchangeService extends BaseApiService<IExchangeDto, LanguageCode> {
  async list(local: LanguageCode = LanguageCode.En): Promise<IExchangeDto[]> {
    return import(`../mocks/exchanges.${local}.mocks.json`)
      .then((module)=>module.default)
      .then((items) => items.filter((item: IExchangeDto) => item._id !== ""));
  }

  async create(_: IExchangeDto): Promise<IExchangeDto> {
    throw new Error(`${this.constructor.name} haven't method create implementation`);
  }

  async delete(_: string): Promise<void | IExchangeDto> {
    throw new Error(`${this.constructor.name} haven't method delete implementation`);
  }

  async get(_: string): Promise<IExchangeDto | null> {
    throw new Error(`${this.constructor.name} haven't method get implementation`);
  }

  async update(_: IExchangeDto): Promise<IExchangeDto | null> {
    throw new Error(`${this.constructor.name} haven't method update implementation`);
  }
}
