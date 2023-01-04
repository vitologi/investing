import CurrencyList from "currency-list";
import {ICurrencyDto} from "../interfaces/currency.dto";
import {BaseApiService} from "../../../../shared/interfaces/base-api.service";
import {LanguageCode} from "../../../intl/shared/enums/language-code";

export class CurrenciesService extends BaseApiService<ICurrencyDto, string | undefined> {
  async list(localeCode: LanguageCode = LanguageCode.En): Promise<ICurrencyDto[]> {
    const result = CurrencyList.getAll(localeCode) as {[code:string]:ICurrencyDto};
    return Object.values(result).map((item)=>({...item, _id: item.code}));
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
