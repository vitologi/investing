import {observer} from "mobx-react-lite";
import {TableCell, TableRow, Typography} from "@mui/material";
import {AssetTypeIcon} from "../../../asset-types/components/asset-type-icon/asset-type-icon";
import {useCurrenciesStore} from "../../../currencies/store/currencies.selector";
import {roundTo} from "../../../../shared/utils/round-to";
import {Ticker} from "../../shared/models/ticker";

interface IProps {
  model: Ticker;
}

export const TickerRow = observer(({model}: IProps) => {
  const currenciesStore = useCurrenciesStore();

  return (
    <TableRow
      key={model.id}
      sx={{'&:last-child td, &:last-child th': {border: 0}}}
    >
      <TableCell padding={"none"} sx={{width: '0'}}>
        <AssetTypeIcon type={model.assetType.id}/>
      </TableCell>

      <TableCell component="th" scope="row">
        {model.security} <Typography color={"text.secondary"} variant={"caption"}>({model.portfolio.name})</Typography>
      </TableCell>

      <TableCell align="right">
        {model.isCurrency ? (
          "-"
        ) : (
          <>
            {roundTo(model.avgPrice())}
            {model.operations[0] && currenciesStore.item(model.operations[0].name || "")?.symbol_native}
          </>
        )}
      </TableCell>

      <TableCell align="right">
        {roundTo(model.amount)}
        &nbsp;
        {model.isCurrency && currenciesStore.item(model.security)?.symbol_native}
      </TableCell>
    </TableRow>
  );
})
