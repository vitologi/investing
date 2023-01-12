import {inject, injectable} from 'inversify';
import {makeObservable, observable} from 'mobx';
import {DomainStore} from "../../../shared/models/domain-store";
import {ITransactionDto} from "../shared/interfaces/transaction.dto";
import {Transaction} from "../shared/models/transaction";
import {TransactionsService} from "../shared/services/transactions.service";

@injectable()
export class TransactionsStore extends  DomainStore<ITransactionDto, Transaction>{
  isAddMode = false;
  constructor(@inject('TransactionsService') transactionsService: TransactionsService) {
    super(transactionsService);
    makeObservable(this, {
      isAddMode: observable,
    });
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
