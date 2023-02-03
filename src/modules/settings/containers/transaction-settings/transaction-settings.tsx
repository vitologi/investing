import {observer} from "mobx-react-lite";
import {Button, ButtonGroup, Card, CardHeader, CardContent, Alert, Snackbar} from "@mui/material";
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

  return (
    <>
      <Card sx={{m: 1}}>
        <CardHeader title={<FormattedMessage id={"app.titles.transactions"}/>}/>

        <CardContent>
          <ButtonGroup>
            <Button onClick={clearHandler}><FormattedMessage id={"app.transactions.actions.clearAll"}/></Button>
            <Button onClick={importHandler}><FormattedMessage id={"app.transactions.actions.import"}/></Button>
            <Button onClick={exportHandler}><FormattedMessage id={"app.transactions.actions.export"}/></Button>
          </ButtonGroup>
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
