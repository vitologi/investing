import CurrencyList from "currency-list";
import {computed, makeObservable} from "mobx";
import {Model} from "../../../../shared/models/model";
import {CurrenciesStore} from "../../store/currencies.store";
import {ICurrencyDto} from "../interfaces/currency.dto";

export class Currency extends Model<ICurrencyDto, CurrenciesStore> {

  constructor(
    protected store: CurrenciesStore,
    public id: string,
  ) {
    super(store, id);
    makeObservable(this, {
      data: computed,
      name: computed,
      name_plural: computed,
      symbol_native: computed,
      symbol: computed,
      code: computed,
      rounding: computed,
      decimal_digits: computed,
    });

  }


  get data() {
    return CurrencyList.get(this.id, this.store.currentLocale);
  }


  get name(): string{
 return this.data.name;
  }
  get name_plural(): string{
 return this.data.name_plural;
  }

  get symbol_native():string {
    return this.data.symbol_native;
  }
  get symbol():string {
    return this.data.symbol;
  }
  get code():string {
    return this.data.code;
  }
  get rounding():number {
    return this.data.rounding;
  }
  get decimal_digits():number {
    return this.data.decimal_digits;
  }

  get asDto(): ICurrencyDto {
    return {
      _id: this.id,
      name: this.name,
      symbol_native: this.symbol_native,
      symbol: this.symbol,
      code: this.code,
      name_plural: this.name_plural,
      rounding: this.rounding,
      decimal_digits: this.decimal_digits,
    };
  }

  dispose(): void {
  }

  protected initialize(): void {
  }

  // currency cant be updated
  updateFromDto(_: ICurrencyDto): void {
    return;
  }

  // currency cant be deleted
  async delete(): Promise<void> {
    return;
  }
}
