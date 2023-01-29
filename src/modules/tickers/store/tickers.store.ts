import {inject, injectable} from 'inversify';
import {action, makeObservable, reaction} from 'mobx';
import {DomainStore} from "../../../shared/models/domain-store";
import {ITickerDto} from "../shared/dtos/ticker.dto";
import {Ticker} from "../shared/models/ticker";
import {TickersService} from "../shared/services/tickers.service";
import {TransactionsStore} from "../../transactions/store/transactions.store";
import {CurrenciesStore} from "../../currencies/store/currencies.store";
import {AssetTypesStore} from "../../asset-types/store/asset-types.store";
import {Currency} from "../../currencies/shared/models/currency";
import {AssetType} from "../../asset-types/shared/models/asset-type";
import {CurrencyTicker} from "../shared/models/currency-ticker";
import {SystemAssetTypes} from "../../asset-types/shared/enums/system-asset-types";

@injectable()
export class TickersStore extends DomainStore<ITickerDto, Ticker> {
  constructor(
    @inject('TickersService') tickersService: TickersService,
    @inject('TransactionsStore') public readonly transactionsStore: TransactionsStore,
    @inject('CurrenciesStore') public readonly currenciesStore: CurrenciesStore,
    @inject('AssetTypesStore') public readonly assetTypesStore: AssetTypesStore,
  ) {
    super(tickersService);
    makeObservable(this, {
      getCurrency: action,
      getAssetType: action,
    });
  }

  getCurrency(code: string): Currency | null {
    return this.currenciesStore.list.find((item) => item.code === code) || null;
  }

  getAssetType(id: string): AssetType | null {
    return this.assetTypesStore.list.find((item) => item.id === id) || null;
  }

  createEmpty(): Ticker {
    return new Ticker(this);
  }

  createFromDto(dto: ITickerDto): Ticker {
    const model = dto.assetType === SystemAssetTypes.CURRENCY ? new CurrencyTicker(this, dto._id) : new Ticker(this, dto._id);
    model.updateFromDto(dto);
    model.init();
    return model;
  }

  protected initialize(): void {
    // this.load();

    /* fill tickers-table with debounce 500ms
     * TODO: need optimization
     * TODO: need to use multiple insertion because async update
     */
    let timer: ReturnType<typeof setTimeout>;
    reaction(
      () => this.transactionsStore.list.length,
      () => {
        clearTimeout(timer);
        timer = setTimeout(async () => {

          for (const ticker of this.buildTickersFromTransactions()) {
            if (this.hasTicker(ticker.security)) {
              return;
            }

            await this.create(ticker.asDto);
          }
        }, 500);
      },
      {fireImmediately: true}
    )

  }


  private hasTicker(security: string): boolean {
    return !!this.list.find((item) => item.security === security)
  }

  private buildTickersFromTransactions(): Ticker[] {
    return Array.from(this.transactionsStore.list.reduce((acc, item) => {
      if (!item.security || acc.has(item.security)) {
        return acc;
      }

      const model = item.isCurrency ? new CurrencyTicker(this) : new Ticker(this);
      model.setSecurity(item.security || '');
      model.setAssetType(item.assetType);
      if (!item.isCurrency) {
        model.setCurrency(item.currency);
      }

      acc.set(item.security, model);
      return acc;
    }, new Map<string, Ticker>()).values());
  }
}
