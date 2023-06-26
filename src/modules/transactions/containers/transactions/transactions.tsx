import {observer} from "mobx-react-lite";
import {TransactionList} from "../transaction-list/transaction-list";
import {TransactionsForm} from "../transaction-form/transactions-form";
import {useTransactionsStore} from "../../store/transactions.selector";
import {useCallback} from "react";
import {AppBar, Button, Dialog, Fab, Toolbar, Typography} from "@mui/material";
import {Add as AddIcon} from "@mui/icons-material";
import {useIntlStore} from "../../../intl/store/intl.selector";
import {FormattedMessage} from "react-intl";

export const Transactions = observer(() => {
  const store = useTransactionsStore();
  const intlStore = useIntlStore();

  const addHandler = useCallback(() => store.toggleDetailsMode(), [store]);

  return (
    <>
      <Dialog
        fullScreen
        open={store.isDetailsMode}
        onClose={addHandler}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              <FormattedMessage id={"app.transactions.title.add"}/>
            </Typography>
            <Button
              autoFocus
              color="inherit"
              onClick={()=>store.setDetailsMode(false)}
            >
              <FormattedMessage id={"app.common.actions.close"} />
            </Button>
          </Toolbar>
        </AppBar>
        <TransactionsForm id={store.editedId}/>
      </Dialog>

      <TransactionList/>

      <Fab
        onClick={addHandler}
        sx={{position: 'fixed', bottom: 16, right: 16}}
        aria-label={intlStore.formatMessage("app.common.actions.add")}
        color="primary"
      >
        <AddIcon/>
      </Fab>
    </>
  );
})
