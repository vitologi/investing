import {sleep} from "../../../../../shared/utils/sleep";
import {ITransactionDto} from "../../dtos/transaction.dto";
import {transactionDto} from "../../dtos/__mocks__/transaction.dto";
import {injectable} from "inversify";

@injectable()
export class TransactionsService {
  static key = Symbol.for('TransactionsService');
  list = jest.fn(async ()=>{
    await sleep(10);
    return [];
  });
  create = jest.fn(async (dto) => dto);
  delete = jest.fn(async (_) => void 0);
  get = jest.fn(async (_):Promise<ITransactionDto> => transactionDto);
  update = jest.fn(async (dto) => dto);
}
