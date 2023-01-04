import {inject, injectable} from 'inversify';
import {action, computed, makeObservable, observable, reaction} from 'mobx';
import {DomainStore} from "../../../shared/models/domain-store";
import {Currency} from "../shared/models/currency";
import {CurrenciesService} from "../shared/services/currencies.service";
import {ICurrencyDto} from "../shared/interfaces/currency.dto";
import {IntlStore} from "../../intl/store/intl.store";
import {LanguageCode} from "../../intl/shared/enums/language-code";
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
      currentLocale: computed,
      isEnabled: computed,
      enabledList: computed,
      sortedByEnablingList: computed,
      toggleEnabled: action,
    });

    this.enabled = this.storageService.get(ENABLED_CURRENCIES, ["USD", "EUR"]);

    reaction(
      () => this.enabled.length,
      async () => {
        this.storageService.set(ENABLED_CURRENCIES, this.enabled.slice());
      }
    );
  }

  get enabledList(): Currency[] {
    return this.list.filter((item) => this.isEnabled(item.id));
  }

  get sortedByEnablingList(): Currency[] {
    const sortedList = this.list.slice().sort((a, _) => this.isEnabled(a.id) ? -1 : 1);
    return sortedList;
  }

  get currentLocale(): LanguageCode {
    return this.intlStore.locale || LanguageCode.En;
  }

  get isEnabled(): (code: string) => boolean {
    return (code: string) => {
      return this.enabled.includes(code);
    }
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
    this.load(LanguageCode.En);
  }

}
