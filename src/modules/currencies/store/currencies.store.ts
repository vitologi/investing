import {inject, injectable} from 'inversify';
import {action, computed, makeObservable, observable, reaction} from 'mobx';
import {DomainStore} from "../../../shared/models/domain-store";
import {Currency} from "../shared/models/currency";
import {CurrenciesService} from "../shared/services/currencies.service";
import {ICurrencyDto} from "../shared/interfaces/currency.dto";
import {IntlStore} from "../../intl/store/intl.store";
import {StorageService} from "../../../shared/services/storage.service";

const ENABLED_CURRENCIES = 'ENABLED_CURRENCIES';

@injectable()
export class CurrenciesStore extends DomainStore<ICurrencyDto, Currency> {
  enabled: string[];

  constructor(
    @inject('CurrenciesService') currenciesService: CurrenciesService,
    @inject('IntlStore') private intlStore: IntlStore,
    @inject('StorageService') private storageService: StorageService,
  ) {
    super(currenciesService);
    makeObservable(this, {
      enabled: observable,
      isEnabled: computed,
      enabledList: computed,
      sortedByEnablingList: computed,
      toggleEnabled: action,
      symbol: action,
    });

    this.enabled = this.storageService.get(ENABLED_CURRENCIES, ["USD", "EUR", "RUB", "HKD"]);

    reaction(
      () => this.enabled.length,
      async () => {
        this.storageService.set(ENABLED_CURRENCIES, this.enabled.slice());
      }
    );

    reaction(
      ()=>this.intlStore.locale,
      (locale)=>{
        this.load(locale);
      }
    )
  }

  get enabledList(): Currency[] {
    return this.list.filter((item) => this.isEnabled(item.id));
  }

  get sortedByEnablingList(): Currency[] {
    const sortedList = this.list.slice().sort((a, _) => this.isEnabled(a.id) ? -1 : 1);
    return sortedList;
  }

  get isEnabled(): (code: string) => boolean {
    return (code: string) => {
      return this.enabled.includes(code);
    }
  }

  symbol(id: string | null): string {
    const currency = this.list.find((item)=>item.id === id)
    return currency ? currency.symbol_native : '';
  }

  toggleEnabled(code: string): void {
    if(this.enabled.includes(code)){
      this.enabled.splice(this.enabled.indexOf(code),1);
    }else {
      this.enabled.push(code);
    }
  }

  createEmpty(): Currency {
    throw new Error('Currency model cant be empty');
  }

  createFromDto(dto: ICurrencyDto): Currency {
    const model = new Currency(this, dto.code);
    model.updateFromDto(dto);
    return model;
  }

  protected async initialize(): Promise<void> {
    this.load(this.intlStore.locale);
  }

}
