import {ITransactionDto} from "../dtos/transaction.dto";
import {transactionsCollection} from "../../offline/transactions.db";
import {BaseApiService} from "../../../../shared/interfaces/base-api.service";
import {injectable} from "inversify";

@injectable()
export class TransactionsService extends BaseApiService<ITransactionDto>{
  static key = Symbol.for('TransactionsService');
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
    // TODO: use this after db library will be fixed
    // const filter = {_id: dto._id};
    // const result = await transactionsCollection.updateOne(filter, {$set:dto}, {});
    //
    // return result.upsertedCount ? dto : null;

    await this.delete(dto._id);
    return this.create(dto);
  }
}
