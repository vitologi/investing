import {inject, injectable} from 'inversify';
import {action, makeObservable, observable} from 'mobx';
import {DomainStore} from "../../../shared/models/domain-store";
import {ITransactionDto} from "../shared/dtos/transaction.dto";
import {Transaction} from "../shared/models/transaction";
import {TransactionsService} from "../shared/services/transactions.service";

@injectable()
export class TransactionsStore extends DomainStore<ITransactionDto, Transaction> {
  isDetailsMode = false;
  editedId: string | null = null

  constructor(@inject('TransactionsService') transactionsService: TransactionsService) {
    super(transactionsService);
    makeObservable(this, {
      isDetailsMode: observable,
      editedId: observable,
      setDetailsMode: action,
      clearTransaction: action,
      chooseTransaction: action,
    });
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

  protected initialize(): void {
    this.load();
  }

}
