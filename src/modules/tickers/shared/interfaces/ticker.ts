import {AssetType} from "../../../asset-types/shared/models/asset-type";
import {Operation} from "../../../transactions/shared/models/operation";
import {Portfolio} from "../../../portfolios/shared/models/portfolio";

export interface ITicker {
  readonly portfolio: Portfolio;
  readonly assetType: AssetType;
  readonly security: string | null;
  readonly amount: number;
  readonly operations: Operation[];

  lastSync: Date;

  avgPrice(currencyCode?: string):number;

  amountOnDate(date?: Date): number;

  isDuplicate(value: ITicker): boolean;
}
