import {observer} from 'mobx-react-lite';
import Grid2 from "@mui/material/Unstable_Grid2";
import {TickersTable} from "../../../tickers/containers/tickers-table/tickers-table";
import {Paper} from "@mui/material";

const Dashboard = observer((): JSX.Element =>{
  return  (
    <Grid2 container={true} p={2}>
      <Grid2 xs={12} sm={12} md={6}>
        <TickersTable/>
      </Grid2>

      <Grid2 xs={12} sm={12} md={6}>
        <Paper></Paper>
      </Grid2>
    </Grid2>
  );
});

export default Dashboard;
