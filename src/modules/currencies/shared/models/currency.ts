import {Model} from "../../../../shared/models/model";
import {CurrenciesStore} from "../../store/currencies.store";
import {ICurrencyDto} from "../interfaces/currency.dto";
import {makeObservable, observable} from "mobx";

export class Currency extends Model<ICurrencyDto, CurrenciesStore> {
  name="US Dollar";
  name_plural="US dollars";
  symbol_native="$";
  symbol="$";
  code="USD";
  rounding=0;
  decimal_digits=2;

  constructor(
    protected store: CurrenciesStore,
    public id: string,
  ) {
    super(store, id);
    makeObservable(this, {
      name: observable,
      name_plural: observable,
      symbol_native: observable,
      symbol: observable,
      code: observable,
      rounding: observable,
      decimal_digits: observable,
    });

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
  updateFromDto(dto: ICurrencyDto): void {
    this.name = dto.name;
    this.symbol_native = dto.symbol_native;
    this.symbol = dto.symbol;
    this.code = dto.code;
    this.name_plural = dto.name_plural;
    this.rounding = dto.rounding;
    this.decimal_digits = dto.decimal_digits;
  }

  // currency cant be deleted
  async delete(): Promise<void> {
    return;
  }
}
