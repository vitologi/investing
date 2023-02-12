import {ICurrencyDto} from "../dtos/currency.dto";
import {BaseApiService} from "../../../../shared/interfaces/base-api.service";
import {LanguageCode} from "../../../intl/shared/enums/language-code";

export class CurrenciesService extends BaseApiService<ICurrencyDto, string | undefined> {
  // TODO: need to refactor this library for partially load dictionaries
  currencyList = import("currency-list").then((currencyList)=>currencyList.default);

  async list(localeCode: LanguageCode = LanguageCode.En): Promise<ICurrencyDto[]> {
    return this.currencyList
      .then((currencyList)=>currencyList.getAll(localeCode))
      .then((result)=>Object.values(result).map((item)=>({...item, _id: item.code})));
  }

  async create(_: ICurrencyDto): Promise<ICurrencyDto> {
   throw new Error(`${this.constructor.name} haven't method create implementation`);
  }

  async delete(_: string): Promise<void | ICurrencyDto> {
    throw new Error(`${this.constructor.name} haven't method delete implementation`);
  }

  async get(_: string): Promise<ICurrencyDto | null> {
    throw new Error(`${this.constructor.name} haven't method get implementation`);
  }

  async update(_: ICurrencyDto): Promise<ICurrencyDto | null> {
    throw new Error(`${this.constructor.name} haven't method update implementation`);
  }
}
