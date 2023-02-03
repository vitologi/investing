import {observer} from "mobx-react-lite";
import {IconButton, TableCell, TableRow, Typography} from "@mui/material";
import {AssetTypeIcon} from "../../../asset-types/components/asset-type-icon/asset-type-icon";
import {useCurrenciesStore} from "../../../currencies/store/currencies.selector";
import {roundTo} from "../../../../shared/utils/round-to";
import {useCallback, useMemo, useState} from "react";
import {CompositeTicker} from "../../shared/models/composite-ticker";

interface IProps {
  model: CompositeTicker;
}

export const TickerRow = observer(({model}: IProps) => {
  const currenciesStore = useCurrenciesStore();
  const hasChild = useMemo(() => model.getChildren().length > 1, [model]);
  const [open, setOpen] = useState(false);
  const openHandler = useCallback(() => setOpen((value) => !value), [setOpen]);

  return (
    <>
      <TableRow
        key={model.id}
        sx={{
          '&:last-child td, &:last-child th': {border: 0},
          ...(open ? {'& > *': {borderBottom: 0}} : null)
        }}
      >
        <TableCell padding={"none"} sx={{width: '0'}}>
          <IconButton disabled={!hasChild} onClick={openHandler}>
            <AssetTypeIcon type={model.assetType.id}/>
          </IconButton>
        </TableCell>

        <TableCell component="th" scope="row">
          <Typography sx={{verticalAlign: "middle"}} component={"span"}>{model.security}</Typography>
          &nbsp;
          <Typography sx={{verticalAlign: "middle"}} component={"span"} color={"text.secondary"} variant={"caption"}>
            ({hasChild ? '-' : model.portfolio.name})
          </Typography>
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

      {open && hasChild && model.getChildren().map((item) => (
        <TableRow key={item.id} sx={{'& > *': {borderBottom: 0, pt: 0, pb: 0}}}>
          <TableCell></TableCell>

          <TableCell component="th" scope="row">
            <Typography sx={{verticalAlign: "middle"}} component={"span"} color={"text.secondary"} variant={"caption"}>
              ({item.portfolio.name})
            </Typography>
          </TableCell>

          <TableCell align="right">
            {item.isCurrency ? (
              "-"
            ) : (
              <>
                {roundTo(item.avgPrice())}
                {item.operations[0] && currenciesStore.item(item.operations[0].name || "")?.symbol_native}
              </>
            )}
          </TableCell>

          <TableCell align="right">
            {roundTo(item.amount)}
            &nbsp;
            {item.isCurrency && currenciesStore.item(item.security)?.symbol_native}
          </TableCell>
        </TableRow>
      ))}
      {open && (<TableRow><TableCell colSpan={4}></TableCell></TableRow>)}
    </>
  );
})
