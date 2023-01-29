import {observer} from "mobx-react-lite";
import {useTickersStore} from "../../store/tickers.selector";
import {
  Paper,
  Table, TableBody, TableCell,
  TableContainer,
  TableHead, TableRow
} from "@mui/material";

export const TickersTable = observer(() => {
  const store = useTickersStore();

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Ticker</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {store.list.map((item) => (
            <TableRow
              key={item.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {item.security}
              </TableCell>
              <TableCell align="right">{item.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
})
