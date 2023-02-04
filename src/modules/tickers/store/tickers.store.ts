import {inject, injectable} from 'inversify';
import {action, computed, makeObservable, reaction} from 'mobx';
import {DomainStore} from "../../../shared/models/domain-store";
import {ITickerDto} from "../shared/dtos/ticker.dto";
import {Ticker} from "../shared/models/ticker";
import {TickersService} from "../shared/services/tickers.service";
import {TransactionsStore} from "../../transactions/store/transactions.store";
import {CurrenciesStore} from "../../currencies/store/currencies.store";
import {AssetTypesStore} from "../../asset-types/store/asset-types.store";
import {Currency} from "../../currencies/shared/models/currency";
import {AssetType} from "../../asset-types/shared/models/asset-type";
import {Transaction} from "../../transactions/shared/models/transaction";
import {SystemAssetTypes} from "../../asset-types/shared/enums/system-asset-types";
import {PortfoliosStore} from "../../portfolios/store/portfolios.store";
import {Portfolio} from "../../portfolios/shared/models/portfolio";
import {CompositeTicker} from "../shared/models/composite-ticker";
import {OperationType} from "../../transactions/shared/enums/operation-type";

@injectable()
export class TickersStore extends DomainStore<ITickerDto, Ticker> {
  constructor(
    @inject('TickersService') tickersService: TickersService,
    @inject('TransactionsStore') public readonly transactionsStore: TransactionsStore,
    @inject('CurrenciesStore') public readonly currenciesStore: CurrenciesStore,
    @inject('AssetTypesStore') public readonly assetTypesStore: AssetTypesStore,
    @inject('PortfoliosStore') public readonly portfoliosStore: PortfoliosStore,
  ) {
    super(tickersService);
    makeObservable(this, {
      transactions: computed,
      compositeList: computed,
      sortedList: computed,
      getCurrency: action,
      getAssetType: action,
      getTickerByTransaction: action,
    });
  }

  get compositeList(): CompositeTicker[] {
    return Array.from(this.list.reduce((acc, item) => {
      const key = [item.assetType, item.security].join('.');
      if (!acc.has(key)) {
        acc.set(key, new CompositeTicker());
      }
      const composite = acc.get(key);
      if (composite) {
        composite.add(item);
      }

      return acc;
    }, new Map<string, CompositeTicker>).values());
  }

  get sortedList(): CompositeTicker[] {
    const sorted = this.compositeList.concat();
    sorted.sort((a, b) => {
      return a.assetType.id === SystemAssetTypes.CURRENCY ? -1
        : b.assetType.id === SystemAssetTypes.CURRENCY ? 1
          : a.assetType.id.localeCompare(b.assetType.id)
          || a.security.localeCompare(b.security);
    });
    return sorted;
  }

  get transactions(): Transaction[] {
    return this.transactionsStore.list;
  }

  getCurrency(code: string): Currency | null {
    return this.currenciesStore.list.find((item) => item.code === code) || null;
  }

  getPortfolio(id: string): Portfolio | null {
    return this.portfoliosStore.list.find((item) => item.id === id) || null;
  }

  getAssetType(id: string): AssetType | null {
    return this.assetTypesStore.list.find((item) => item.id === id) || null;
  }

  getTickerByTransaction(transaction: Transaction, operationType: OperationType = OperationType.Forward): Ticker | null {
    const operation = transaction.operationByType(operationType);
    if(!operation){
      return null;
    }

    return this.list.find((item) => (
      item.portfolio.id === transaction.portfolio
      && item.assetType.id === operation.assetType
      && item.security === operation.name
    )) || null;
  }

  createEmpty(): Ticker {
    return new Ticker(this);
  }

  createFromDto(dto: ITickerDto): Ticker {
    const model = new Ticker(this, dto._id);
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
            if (this.hasTicker(ticker)) {
              return;
            }

            await this.create(ticker.asDto);
          }

          // recalculate amount
          this.list.forEach((item) => item.init());
        }, 500);
      },
      {fireImmediately: true}
    );

  }


  private hasTicker(model: Ticker): boolean {
    return !!this.list.find((item) => item.isDuplicate(model));
  }

  private buildTickersFromTransactions(): Ticker[] {
    return Array.from(
      this.transactionsStore.list
        .map((transaction) => transaction.operations.map((operation) => ({
          portfolio: transaction.portfolio,
          assetType: operation.assetType,
          security: operation.name,
        })))
        .flat()
        .reduce((acc, {portfolio, assetType, security}) => {
          if (!portfolio || !assetType || !security || acc.has([portfolio, assetType, security].join('.'))) {
            return acc;
          }

          const model = new Ticker(this);
          model.setPortfolio(portfolio);
          model.setAssetType(assetType);
          model.setSecurity(security);
          acc.set([portfolio, assetType, security].join('.'), model);
          return acc;
        }, new Map<string, Ticker>()).values());
  }
}
