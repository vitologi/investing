import {ITransactionDto} from "../interfaces/transaction.dto";
import {transactionsCollection} from "../../offline/transactions.db";
import {BaseApiService} from "../../../../shared/interfaces/base-api.service";

export class TransactionsService extends BaseApiService<ITransactionDto>{
  async list(): Promise<ITransactionDto[]> {
    return transactionsCollection.find({});
  }

  async create(dto: ITransactionDto): Promise<ITransactionDto> {
    await transactionsCollection.insertOne(dto);

    return dto;
  }

  async delete(id: string): Promise<void | ITransactionDto> {
    await transactionsCollection.deleteOne({_id: id});
    return;
  }

  async get(id: string): Promise<ITransactionDto | null> {
    return transactionsCollection.findOne({_id: id});
  }

  async update(dto: ITransactionDto): Promise<ITransactionDto| null> {
    const filter = {_id: dto._id};
    const result = await transactionsCollection.updateOne(filter, {$set:dto}, {});

    return result.upsertedCount ? dto : null;
  }
}
