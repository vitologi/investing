import {SystemAssetTypes} from "../../shared/enums/system-asset-types";
import {
  AccountBalance as AccountBalanceIcon,
  AttachMoney as AttachMoneyIcon,
  Receipt as ReceiptIcon, WorkOutline as WorkOutlineIcon
} from "@mui/icons-material";

interface IProps {
  type?: SystemAssetTypes | string | null;
}
export const AssetTypeIcon = (props: IProps)=>{
  const {type} = props;

  switch (type) {
    case SystemAssetTypes.CURRENCY:
      return <AttachMoneyIcon/>;

    case SystemAssetTypes.BOND:
    case SystemAssetTypes.EQUITY:
      return <ReceiptIcon/>;

    case SystemAssetTypes.FUTURE:
      return <AccountBalanceIcon/>;

    case SystemAssetTypes.MUTUALFUND:
    case SystemAssetTypes.ETF:
    default:
      return <WorkOutlineIcon/>
  }
}
