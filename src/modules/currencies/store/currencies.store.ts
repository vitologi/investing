import {inject, injectable} from 'inversify';
import {action, computed, makeObservable, observable, reaction, when} from 'mobx';
import {DomainStore} from "../../../shared/models/domain-store";
import {Currency} from "../shared/models/currency";
import {CurrenciesService} from "../shared/services/currencies.service";
import {ICurrencyDto} from "../shared/dtos/currency.dto";
import {IntlStore} from "../../intl/store/intl.store";
import {StorageService} from "../../../shared/services/storage.service";
import {CurrencyRatesService} from "../shared/services/currency-rates.service";
import {OpenexchangeratesProvider} from "../shared/services/openexchangerates.provider";
import {parseToTimestamp} from "../shared/utils/parse-to-timestamp";
import {CurrencyRateProvider} from "../shared/enums/currency-rate-provider";
import {ICurrencyRatesProvider} from "../shared/interfaces/currency-rates.provider";

export const ENABLED_CURRENCIES = 'ENABLED_CURRENCIES';
export const RATE_PROVIDER = 'RATE_PROVIDER';
export const OPEN_EXCHANGE_RATES_API_TOKEN = 'OPEN_EXCHANGE_RATES_API_TOKEN';

@injectable()
export class CurrenciesStore extends DomainStore<ICurrencyDto, Currency> {
  isInit = false;
  _baseCurrencyCode = 'USD';

  openExchangeRatesApiToken: string | null = null;
  rateProvider = CurrencyRateProvider.Empty;
  enabled: string[];

  storedExchangeRates = new Map<string, number>();

  constructor(
    @inject('CurrenciesService') currenciesService: CurrenciesService,
    @inject('CurrencyRatesService') private currencyRatesService: CurrencyRatesService,
    @inject('IntlStore') private intlStore: IntlStore,
    @inject('StorageService') private storageService: StorageService,
  ) {
    super(currenciesService);
    makeObservable(this, {
      isInit: observable,
      _baseCurrencyCode: observable,
      rateProvider: observable,
      storedExchangeRates: observable,
      enabled: observable,
      openExchangeRatesApiToken: observable,
      baseCurrency: computed,
      convert: computed,
      isEnabled: computed,
      enabledList: computed,
      sortedByEnablingList: computed,
      setBaseCurrency: action,
      setRateProvider: action,
      toggleEnabled: action,
      symbol: action,
      setOpenExchangeRatesApiToken: action,
      setStoredExchangeRate: action,
      removeStoredExchangeRate: action,
      init: action,
    });

    reaction(
      () => this.intlStore.locale,
      (locale) => {
        this.load(locale).then(() => this.init());
      },
      {fireImmediately: true}
    );

    this.enabled = this.storageService.get(ENABLED_CURRENCIES, ["USD", "EUR", "RUB", "HKD"]);
    reaction(
      () => this.enabled.length,
      () => this.storageService.set(ENABLED_CURRENCIES, this.enabled.slice()),
    );

    const openExchangeRatesApiToken = this.storageService.get(OPEN_EXCHANGE_RATES_API_TOKEN, null);
    this.setOpenExchangeRatesApiToken(openExchangeRatesApiToken);
    reaction(
      () => this.openExchangeRatesApiToken,
      () => this.storageService.set(OPEN_EXCHANGE_RATES_API_TOKEN, this.openExchangeRatesApiToken),
    );

    const rateProvider = this.storageService.get(RATE_PROVIDER, CurrencyRateProvider.Empty);
    this.setRateProvider(rateProvider);
    reaction(
      () => this.rateProvider,
      () => this.storageService.set(RATE_PROVIDER, this.rateProvider),
    );
  }

  get baseCurrency(): Currency | null {
    return this.item(this._baseCurrencyCode) || null;
  }

  get convert(): (amount: number, from: string, to: string, date?: number) => number {
    return (amount: number, from: string, to: string, date?: number) => {
      const timestamp = parseToTimestamp(date); // include date assertions
      const key = [from, to, timestamp].join('.');

      if (from === to) {
        return amount;
      }

      const rate = this.storedExchangeRates.get(key);
      if (rate) {
        return amount * rate;
      }

      // TODO: here we have multiple deferred requests (need ot fix it)
      this.currencyRatesService.getExchangeRate({from, to, date: new Date(timestamp)})
        .then((result) => this.setStoredExchangeRate(key, result))
        .catch(console.log);

      return amount;
    }
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

  init(): void {
    this.isInit = true;
  }

  setBaseCurrency(value: string): void {
    this._baseCurrencyCode = value;
  }

  setRateProvider(value: CurrencyRateProvider): void {
    let provider: ICurrencyRatesProvider;

    switch (value) {
      case CurrencyRateProvider.Openexchangerates:
      default:
        provider = new OpenexchangeratesProvider();
        when(
          () => !!this.openExchangeRatesApiToken,
          () => {
            provider.setSecureToken(this.openExchangeRatesApiToken as string);
          },
        );
        break;
    }

    this.rateProvider = value;
    this.currencyRatesService.setProvider(provider);
  }

  symbol(id: string | null): string {
    const currency = this.list.find((item) => item.id === id)
    return currency ? currency.symbol_native : '';
  }

  toggleEnabled(code: string): void {
    if (this.enabled.includes(code)) {
      this.enabled.splice(this.enabled.indexOf(code), 1);
    } else {
      this.enabled.push(code);
    }
  }

  setOpenExchangeRatesApiToken(value: string | null): void {
    this.openExchangeRatesApiToken = value;
  }

  setStoredExchangeRate(key: string, value: number): void {
    this.storedExchangeRates.set(key, value);
  }

  removeStoredExchangeRate(key: string): void {
    this.storedExchangeRates.delete(key);
  }

  createEmpty(): Currency {
    throw new Error('Currency model cant be empty');
  }

  createFromDto(dto: ICurrencyDto): Currency {
    const model = new Currency(this, dto.code);
    model.updateFromDto(dto);
    return model;
  }
}
