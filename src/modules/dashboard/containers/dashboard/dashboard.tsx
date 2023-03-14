import {observer} from 'mobx-react-lite';
import Grid2 from "@mui/material/Unstable_Grid2";
import {TickersTable} from "../../../tickers/containers/tickers-table/tickers-table";
import {Card, CardContent, CardHeader, Paper} from "@mui/material";
import {FormattedMessage} from "react-intl";

const Dashboard = observer((): JSX.Element => {
  return (
    <Grid2 container={true} p={2}>
      <Grid2 xs={12} sm={12} md={12}>
        <Card>
          <CardHeader title={<FormattedMessage id={"app.titles.tickers"}/>}/>
          <CardContent sx={{p: 0, '&:last-child': { pb: 0 }}}>
            <TickersTable/>
          </CardContent>
        </Card>
      </Grid2>

      <Grid2 xs={12} sm={12} md={6}>
        <Paper></Paper>
      </Grid2>
    </Grid2>
  );
});

export default Dashboard;
