import {IOperationDto} from "../../../transactions/shared/dtos/operation.dto";

export interface ITickerDto {
  _id: string;
  lastSync: number; // date of last sync
  portfolio: string | null;  // id of portfolio
  assetType: string | null;  // id of assetType
  name: string | null;   // ticker symbol
  amount: number;
  opposite: IOperationDto[];
}
