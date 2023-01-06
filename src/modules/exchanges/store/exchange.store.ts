import {inject, injectable} from 'inversify';
import {action, computed, makeObservable, observable, reaction} from 'mobx';
import {DomainStore} from "../../../shared/models/domain-store";
import {IExchangeDto} from "../shared/interfaces/exchange.dto";
import {Exchange} from "../shared/models/exchange";
import {ExchangeService} from "../shared/services/exchange.service";
import {IntlStore} from "../../intl/store/intl.store";
import {StorageService} from "../../../shared/services/storage.service";

const ENABLED_EXCHANGES = 'ENABLED_EXCHANGES';

@injectable()
export class ExchangeStore extends  DomainStore<IExchangeDto, Exchange>{
  enabled: string[];

  constructor(
    @inject('ExchangeService') exchangeService: ExchangeService,
    @inject('IntlStore') private intlStore: IntlStore,
    @inject('StorageService') private storageService: StorageService,
    ) {
    super(exchangeService);
    makeObservable(this, {
      enabled: observable,
      isEnabled: computed,
      enabledList: computed,
      sortedByEnablingList: computed,
      toggleEnabled: action,
    });

    this.enabled = this.storageService.get(ENABLED_EXCHANGES, ["XNYS", "XNAS"]);

    reaction(
      () => this.enabled.length,
      async () => {
        this.storageService.set(ENABLED_EXCHANGES, this.enabled.slice());
      }
    );

    reaction(
      ()=>this.intlStore.locale,
      (locale)=>{
        this.load(locale);
      }
    )
  }

  get enabledList(): Exchange[] {
    return this.list.filter((item) => this.isEnabled(item.id));
  }

  get sortedByEnablingList(): Exchange[] {
    const sortedList = this.list.slice().sort((a, _) => this.isEnabled(a.id) ? -1 : 1);
    return sortedList;
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

  createEmpty(): Exchange {
    throw new Error('Exchange model cant be empty');
  }

  createFromDto(dto: IExchangeDto): Exchange {
    const model = new Exchange(this, dto._id);
    model.updateFromDto(dto);
    return model;
  }

  protected initialize(): void {
    this.load(this.intlStore.locale);
  }

}
