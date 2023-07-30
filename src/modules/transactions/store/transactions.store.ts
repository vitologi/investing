import {inject, injectable} from 'inversify';
import {action, computed, makeObservable, observable} from 'mobx';
import {isBefore} from "date-fns";
import {DomainStore} from "../../../shared/models/domain-store";
import {ITransactionDto} from "../shared/dtos/transaction.dto";
import {Transaction} from "../shared/models/transaction";
import {TransactionsService} from "../shared/services/transactions.service";
import {CommandsStore} from "../../events/store/commands.store";
import {TransferBetweenPortfolioCommand} from "../shared/models/transfer-between-portfolio.command";

@injectable()
export class TransactionsStore extends DomainStore<ITransactionDto, Transaction> {
  static key = Symbol.for('TransactionsStore');
  isInit = false;
  isDetailsMode = false;
  editedId: string | null = null

  constructor(
    @inject(TransactionsService.key) transactionsService: TransactionsService,
    @inject(CommandsStore.key) private commandsStore: CommandsStore,
  ) {
    super(transactionsService);
    makeObservable(this, {
      isInit: observable,
      isDetailsMode: observable,
      editedId: observable,
      sortedList: computed,
      init: action,
      setDetailsMode: action,
      clearTransaction: action,
      chooseTransaction: action,
      clearAllTransactions: action,
      toggleDetailsMode: action,
    });

    this.load().then(() => this.init());
  }

  get sortedList(): Transaction[] {
    const sorted = this.list.concat();
    sorted.sort((a, b) => a.date < b.date ? 1 : -1);
    return sorted;
  }

  init(): void {
    this.isInit = true;
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
    return new Transaction(this);
  }

  createFromDto(dto: ITransactionDto): Transaction {
    const model = new Transaction(this, dto._id);
    model.updateFromDto(dto);
    return model;
  }

  async mergePortfolioTransactions(props: { from: string; to: string; date: Date; }): Promise<void> {
    const {from, to, date} = props;
    // TODO: optimize transactions searching use queries into db
    const transactions = this.list.filter((item) => (isBefore(item.date, date) && item.portfolio === from));
    const commands = transactions.map((transaction) => new TransferBetweenPortfolioCommand({
      broker: this,
      transactionId: transaction.id,
      newPortfolioId: to,
      oldPortfolioId: from
    }));
    const executed = [];
    try {
      for (const command of commands) {
        await this.commandsStore.executeCommand(command);
        executed.push(command);
      }
    } catch (e) {
      console.log(e); // TODO: handle error

      executed.reverse();
      // revert processed
      for (const command of executed) {
        await this.commandsStore.undoCommand(command);
      }
    }
  }

  async changePortfolio(id: string, newPortfolioId: string, oldPortfolioId: string): Promise<void>{
    const transaction = this.item(id);

    // TODO: split it on several assertions
    if (
      !transaction
      || !transaction.portfolio
      || transaction.portfolio !== oldPortfolioId
    ) {
      throw new Error(`Transaction with id: ${id} haven't been found`);
    }

    transaction.setPortfolio(newPortfolioId);
    try {
      await this.save(transaction.asDto);
    } catch (e) {
      // TODO: replace on notification store
      console.log(`Something went wrong with transfer between portfolio command`);
      transaction.setPortfolio(oldPortfolioId);
    }
  }
}
