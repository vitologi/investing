import {TransactionType} from "../enums/transaction-type";
import {OperationType} from "../enums/operation-type";
import {IOperationDto} from "../dtos/operation.dto";
import {OperationDirection} from "../enums/operation-direction";
import {SystemAssetTypes} from "../../../asset-types/shared/enums/system-asset-types";

export function getDefaultOperations(transactionType: TransactionType): IOperationDto[] {
  switch (transactionType) {
    case TransactionType.Deposit:
      return [
        {
          type: OperationType.Forward,
          assetType: SystemAssetTypes.CURRENCY,
          name: null,
          amount: 0,
          direction: OperationDirection.Positive,
        },
      ];

    case TransactionType.Withdrawal:
    case TransactionType.Loss:
      return [
        {
          type: OperationType.Forward,
          assetType: SystemAssetTypes.CURRENCY,
          name: null,
          amount: 0,
          direction: OperationDirection.Negative,
        },
      ];

    case TransactionType.Buy:
      return [
        {
          type: OperationType.Forward,
          assetType: null,
          name: null,
          amount: 0,
          direction: OperationDirection.Positive,
        },
        {
          type: OperationType.Backward,
          assetType: SystemAssetTypes.CURRENCY,
          name: null,
          amount: 0,
          direction: OperationDirection.Negative,
        },
        {
          type: OperationType.Commission,
          assetType: SystemAssetTypes.CURRENCY,
          name: null,
          amount: 0,
          direction: OperationDirection.Negative,
        },
      ];

    case TransactionType.Sell:
      return [
        {
          type: OperationType.Forward,
          assetType: null,
          name: null,
          amount: 0,
          direction: OperationDirection.Negative,
        },
        {
          type: OperationType.Backward,
          assetType: SystemAssetTypes.CURRENCY,
          name: null,
          amount: 0,
          direction: OperationDirection.Positive,
        },
        {
          type: OperationType.Commission,
          assetType: SystemAssetTypes.CURRENCY,
          name: null,
          amount: 0,
          direction: OperationDirection.Negative,
        },
      ];

    case TransactionType.DRIP:
      return [
        {
          type: OperationType.Forward,
          assetType: SystemAssetTypes.EQUITY,
          name: null,
          amount: 0,
          direction: OperationDirection.Neutral,
        },
        {
          type: OperationType.Backward,
          assetType: SystemAssetTypes.EQUITY,
          name: null,
          amount: 0,
          direction: OperationDirection.Positive,
        },
      ];

    case TransactionType.Dividend:
      return [
        {
          type: OperationType.Forward,
          assetType: SystemAssetTypes.EQUITY,
          name: null,
          amount: 0,
          direction: OperationDirection.Neutral,
        },
        {
          type: OperationType.Backward,
          assetType: SystemAssetTypes.CURRENCY,
          name: null,
          amount: 0,
          direction: OperationDirection.Positive,
        },
        {
          type: OperationType.Tax,
          assetType: SystemAssetTypes.CURRENCY,
          name: null,
          amount: 0,
          direction: OperationDirection.Neutral,
        },
      ];

    case TransactionType.Coupon:
      return [
        {
          type: OperationType.Forward,
          assetType: SystemAssetTypes.BOND,
          name: null,
          amount: 0,
          direction: OperationDirection.Neutral,
        },
        {
          type: OperationType.Backward,
          assetType: SystemAssetTypes.CURRENCY,
          name: null,
          amount: 0,
          direction: OperationDirection.Positive,
        },
        {
          type: OperationType.Tax,
          assetType: SystemAssetTypes.CURRENCY,
          name: null,
          amount: 0,
          direction: OperationDirection.Neutral,
        },
      ];

    default:
      return [];
  }
}
