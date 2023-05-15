import {sleep} from "../../../../../shared/utils/sleep";
import { list } from "../../dtos/__mocks__/exchange.dto";

export class ExchangeService {
   list = jest.fn(async ()=>{
     await sleep(20);
     return list;
   });
}
