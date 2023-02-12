import {AssetType} from "../../../asset-types/shared/models/asset-type";
import {Operation} from "../../../transactions/shared/models/operation";
import {Portfolio} from "../../../portfolios/shared/models/portfolio";
import {IOperation} from "../../../transactions/shared/interfaces/operation";

export interface ITicker {
  readonly id: string;
  readonly portfolio: Portfolio;
  readonly assetType: AssetType;
  readonly security: string;
  readonly amount: number;
  readonly operations: Operation[];
  readonly isCurrency: boolean;
  readonly baseCurrencyCode: string;  // TODO: handle different children currencies and taxes (if it was needed)

  lastSync: Date;

  avgPrice(currencyCode?: string): number;

  amountOnDate(date?: Date): number;

  oppositeOnDate(date?: Date): IOperation[];

  isDuplicate(value: ITicker): boolean;
}
