import {observer} from "mobx-react-lite";
import {TransactionList} from "../transaction-list/transaction-list";
import {TransactionsForm} from "../transaction-form/transactions-form";
import {useTransactionsStore} from "../../store/transactions.selector";
import {useCallback} from "react";
import {Fab} from "@mui/material";
import {Add as AddIcon} from "@mui/icons-material";
import {useIntlStore} from "../../../intl/store/intl.selector";

export const Transactions = observer(() => {
  const store = useTransactionsStore();
  const intlStore = useIntlStore();

  const addHandler = useCallback(() => store.toggleDetailsMode(), [store]);

  return (
    <>
      {store.isDetailsMode && <TransactionsForm id={store.editedId}/>}

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
