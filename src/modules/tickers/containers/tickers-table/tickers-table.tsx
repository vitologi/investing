import {observer} from "mobx-react-lite";
import {useTickersStore} from "../../store/tickers.selector";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {TickerRow} from "../ticker-row/ticker-row";
import {FormattedMessage} from "react-intl";

export const TickersTable = observer(() => {
  const store = useTickersStore();

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table" size={"small"}>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Ticker</TableCell>
            <TableCell align="right">
              <FormattedMessage id={"app.tickers.table.avgCostInCurrency"}/>
            </TableCell>
            <TableCell align="right">
              <FormattedMessage id={"app.tickers.table.avgCost"}/>
            </TableCell>
            <TableCell align="right">
              <FormattedMessage id={"app.tickers.table.amount"}/>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {store.sortedList.map((item) => (<TickerRow key={item.id} model={item}/>))}
        </TableBody>
      </Table>
      {/*<Toolbar sx={{pl: {sm: 2}, pr: {xs: 1, sm: 1}}}>*/}

      {/*  <Typography*/}
      {/*    sx={{flex: '1 1 100%'}}*/}
      {/*    variant="h6"*/}
      {/*    id="tableTitle"*/}
      {/*    component="div"*/}
      {/*  >*/}
      {/*    */}
      {/*  </Typography>*/}

      {/*  <Tooltip title="Filter list">*/}
      {/*    <IconButton>*/}
      {/*      <SettingsIcon/>*/}
      {/*    </IconButton>*/}
      {/*  </Tooltip>*/}
      {/*</Toolbar>*/}

    </TableContainer>
  );
})
