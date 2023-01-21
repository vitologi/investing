import {inject, injectable} from 'inversify';
import {action, computed, makeObservable, observable} from 'mobx';
import {DomainStore} from "../../../shared/models/domain-store";
import {ITransactionDto} from "../shared/dtos/transaction.dto";
import {Transaction} from "../shared/models/transaction";
import {TransactionsService} from "../shared/services/transactions.service";
import {AssetTypesStore} from "../../asset-types/store/asset-types.store";
import {CurrenciesStore} from "../../currencies/store/currencies.store";
import {PortfoliosStore} from "../../portfolios/store/portfolios.store";

@injectable()
export class TransactionsStore extends DomainStore<ITransactionDto, Transaction> {
  isDetailsMode = false;
  editedId: string | null = null

  constructor(
    @inject('TransactionsService') transactionsService: TransactionsService,
    @inject('AssetTypesStore') private assetTypesStore: AssetTypesStore,
    @inject('CurrenciesStore') private currenciesStore: CurrenciesStore,
    @inject('PortfoliosStore') private portfoliosStore: PortfoliosStore,
  ) {
    super(transactionsService);
    makeObservable(this, {
      isDetailsMode: observable,
      editedId: observable,
      sortedList: computed,
      setDetailsMode: action,
      clearTransaction: action,
      chooseTransaction: action,
      clearAllTransactions: action,
      toggleDetailsMode: action,
    });
  }

  get sortedList(): Transaction[] {
    const sorted = this.list.concat();
    sorted.sort((a, b) => a.date < b.date ? 1 : -1);
    return sorted;
  }

  async clearAllTransactions(): Promise<void> {
    for (const item of this.list) {
      await this.delete(item.asDto);
    }
  }

  toggleDetailsMode(): void {
    this.isDetailsMode = !this.isDetailsMode;
  }

  setDetailsMode(value: boolean): void {
    this.isDetailsMode = value;
  }

  clearTransaction(): void {
    this.editedId = null;
  }

  chooseTransaction(value: Transaction): void {
    this.editedId = value.id;
  }

  createEmpty(): Transaction {
    const model = new Transaction(this);
    model.setAssetType(this.assetTypesStore.list[0] || null);
    model.setCurrency(this.currenciesStore.enabledList[0] || null);
    model.setPortfolio(this.portfoliosStore.list[0] || null);
    return model;
  }

  createFromDto(dto: ITransactionDto): Transaction {
    const model = new Transaction(this, dto._id);
    model.updateFromDto(dto);
    return model;
  }

  protected initialize(): void {
    this.load();
  }

}
