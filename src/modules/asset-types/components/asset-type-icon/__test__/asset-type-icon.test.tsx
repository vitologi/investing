import {render} from "@testing-library/react";
import {SystemAssetTypes} from "../../../shared/enums/system-asset-types";
import {AssetTypeIcon} from "../asset-type-icon";

describe('AssetTypeIcon component', () => {
  test('renders AttachMoneyIcon for SystemAssetTypes.CURRENCY', () => {
    const {getByTestId} = render(<AssetTypeIcon type={SystemAssetTypes.CURRENCY}/>);
    expect(getByTestId('AttachMoneyIcon')).toBeTruthy();
  });

  test('renders ReceiptIcon for SystemAssetTypes.BOND', () => {
    const {getByTestId} = render(<AssetTypeIcon type={SystemAssetTypes.BOND}/>);
    expect(getByTestId('ReceiptIcon')).toBeTruthy();
  });

  test('renders ReceiptIcon for SystemAssetTypes.EQUITY', () => {
    const {getByTestId} = render(<AssetTypeIcon type={SystemAssetTypes.EQUITY}/>);
    expect(getByTestId('ReceiptIcon')).toBeTruthy();
  });

  test('renders AccountBalanceIcon for SystemAssetTypes.FUTURE', () => {
    const {getByTestId} = render(<AssetTypeIcon type={SystemAssetTypes.FUTURE}/>);
    expect(getByTestId('AccountBalanceIcon')).toBeTruthy();
  });

  test('renders WorkOutlineIcon for SystemAssetTypes.MUTUALFUND', () => {
    const {getByTestId} = render(<AssetTypeIcon type={SystemAssetTypes.MUTUALFUND}/>);
    expect(getByTestId('WorkOutlineIcon')).toBeTruthy();
  });

  test('renders WorkOutlineIcon for SystemAssetTypes.ETF', () => {
    const {getByTestId} = render(<AssetTypeIcon type={SystemAssetTypes.ETF}/>);
    expect(getByTestId('WorkOutlineIcon')).toBeTruthy();
  });

  test('renders WorkOutlineIcon for null type prop', () => {
    const {getByTestId} = render(<AssetTypeIcon type={null}/>);
    expect(getByTestId('WorkOutlineIcon')).toBeTruthy();
  });

  test('renders WorkOutlineIcon for unknown string type prop', () => {
    const {getByTestId} = render(<AssetTypeIcon type="invalid-type"/>);
    expect(getByTestId('WorkOutlineIcon')).toBeTruthy();
  });

  test('renders WorkOutlineIcon for undefined type prop', () => {
    const {getByTestId} = render(<AssetTypeIcon/>);
    expect(getByTestId('WorkOutlineIcon')).toBeTruthy();
  });
});
