import {AssetType} from "../../../asset-types/shared/models/asset-type";
import {Currency} from "../../../currencies/shared/models/currency";
import {Transaction} from "../../../transactions/shared/models/transaction";

export interface ITicker {
  readonly assetType: AssetType;
  readonly currency: Currency | null;
  readonly security: string | null;
  readonly transactions: Transaction[];

  readonly amount: number;

  amountOnDate(date?: Date): number;
}
