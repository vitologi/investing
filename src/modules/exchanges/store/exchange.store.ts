import {inject, injectable} from 'inversify';
import {action, computed, makeObservable, observable, reaction} from 'mobx';
import {DomainStore} from "../../../shared/models/domain-store";
import {IExchangeDto} from "../shared/dtos/exchange.dto";
import {Exchange} from "../shared/models/exchange";
import {ExchangeService} from "../shared/services/exchange.service";
import {IntlStore} from "../../intl/store/intl.store";
import {StorageService} from "../../../shared/services/storage.service";

export const ENABLED_EXCHANGES = 'ENABLED_EXCHANGES';

@injectable()
export class ExchangeStore extends DomainStore<IExchangeDto, Exchange> {
  static key = Symbol.for('ExchangeStore');
  isInit = false;
  enabled: string[];

  constructor(
    @inject(ExchangeService.key) exchangeService: ExchangeService,
    @inject(IntlStore.key) private intlStore: IntlStore,
    @inject(StorageService.key) private storageService: StorageService,
  ) {
    super(exchangeService);
    makeObservable(this, {
      isInit: observable,
      enabled: observable,
      isEnabled: computed,
      enabledList: computed,
      sortedByEnablingList: computed,
      init: action,
      toggleEnabled: action,
      getExchangeBySuffix: action,
      getExchangeByMic: action,
    });

    this.enabled = this.storageService.get(ENABLED_EXCHANGES, ["XNYS", "XNAS"]);
    reaction(
      () => this.enabled.length,
      async () => {
        this.storageService.set(ENABLED_EXCHANGES, this.enabled.slice());
      }
    );

    reaction(
      () => this.intlStore.locale,
      (locale) => {
        this.load(locale).then(() => this.init());
      },
      {fireImmediately: true}
    )
  }

  get enabledList(): Exchange[] {
    return this.list.filter((item) => this.isEnabled(item.id));
  }

  get sortedByEnablingList(): Exchange[] {
    return this.list.slice().sort((a, _) => this.isEnabled(a.id) ? -1 : 1);
  }

  get isEnabled(): (code: string) => boolean {
    return (code: string) => {
      return this.enabled.includes(code);
    }
  }

  init(): void {
    this.isInit = true;
  }

  toggleEnabled(code: string): void {
    if (this.enabled.includes(code)) {
      this.enabled.splice(this.enabled.indexOf(code), 1);
    } else {
      this.enabled.push(code);
    }
  }

  getExchangeByMic(mic: string): string | null {
    const model = this.list.find((item) => item.mic === mic);
    return model ? model.id : null;
  }

  getExchangeBySuffix(suffix: string): string | null {
    const model = this.list.find((item) => item.yahooSuffix === suffix);
    return model ? model.id : null;
  }

  createEmpty(): Exchange {
    throw new Error('Exchange model cant be empty');
  }

  createFromDto(dto: IExchangeDto): Exchange {
    const model = new Exchange(this, dto._id);
    model.updateFromDto(dto);
    return model;
  }
}
