import {observer} from "mobx-react-lite";
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  Alert,
  Snackbar,
  Tooltip,
  Stack, CircularProgress
} from "@mui/material";
import {FormattedMessage} from "react-intl";
import {useTransactionsTransferStore} from "../../../transactions/store/transactions-transfer.selector";
import {SyntheticEvent, useCallback, useState} from "react";

export const TransactionSettings = observer(() => {
  const transferStore = useTransactionsTransferStore();
  const [openAlert, setOpenAlert] = useState(false);

  // TODO: move alert feature into notification store
  const successHandler = useCallback(() => {
    setOpenAlert(true);
  }, [setOpenAlert]);

  const handleClose = (_?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAlert(false);
  };

  const clearHandler = useCallback(
    () => transferStore.clearAllTransactions().then(successHandler),
    [transferStore, successHandler]
  );
  const importHandler = useCallback(
    () => transferStore.importTransactions().then(successHandler),
    [transferStore, successHandler]
  );
  const exportHandler = useCallback(
    () => transferStore.exportTransactions().then(successHandler),
    [transferStore, successHandler]
  );
  const adjustBalanceHandler = useCallback(
    () => transferStore.adjustBalance().then(successHandler),
    [transferStore, successHandler]
  );

  return (
    <>
      <Card sx={{m: 1}}>
        <CardHeader title={<FormattedMessage id={"app.titles.transactions"}/>}/>

        <CardContent>
          <Stack direction={"column"} spacing={2}>

            <Stack direction={"row"} spacing={2}>
              <Button variant={"outlined"} onClick={clearHandler}>
                <FormattedMessage id={"app.transactions.actions.clearAll"}/>
              </Button>
              <Button variant={"outlined"} onClick={importHandler}>
                <FormattedMessage id={"app.transactions.actions.import"}/>
              </Button>
              <Button variant={"outlined"} onClick={exportHandler}>
                <FormattedMessage id={"app.transactions.actions.export"}/>
              </Button>
            </Stack>

            <Stack direction={"row"} spacing={2}>
              <Tooltip title={<FormattedMessage id={"app.transactions.description.adjustBalance"}/>}
                       placement="right-start">
                <Button
                  variant={"outlined"}
                  onClick={adjustBalanceHandler}
                  startIcon={<CircularProgress variant="determinate" value={transferStore.process}/>}
                >
                  <FormattedMessage id={"app.transactions.actions.adjustBalance"}/>
                </Button>
              </Tooltip>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Snackbar
        open={openAlert}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{vertical: "bottom", horizontal: "center"}}
      >
        <Alert onClose={handleClose} severity="success" sx={{width: '100%'}}>
          <FormattedMessage id={"app.common.actions.success"}/>
        </Alert>
      </Snackbar>
    </>
  );
})
