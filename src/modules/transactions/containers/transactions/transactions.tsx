import {observer} from "mobx-react-lite";
import {TransactionList} from "../transaction-list/transaction-list";
import {TransactionsForm} from "../transaction-form/transactions-form";
import {useTransactionsStore} from "../../store/transactions.selector";
import {useCallback} from "react";
import {Button, Fab} from "@mui/material";
import {Add as AddIcon} from "@mui/icons-material";
import {useIntlStore} from "../../../intl/store/intl.selector";
import {useTransactionsTransferStore} from "../../store/transactions-transfer.selector";

export const Transactions = observer(() => {
  const store = useTransactionsStore();
  const transferStore = useTransactionsTransferStore();
  const intlStore = useIntlStore();

  const addHandler = useCallback(() => store.toggleDetailsMode(), [store]);

  const clearHandler = useCallback(()=>transferStore.clearAllTransactions(), [transferStore]);
  const importHandler = useCallback(()=>transferStore.importTransactions(), [transferStore]);
  const exportHandler = useCallback(()=>transferStore.exportTransactions(), [transferStore]);

  return (
    <>
      {store.isDetailsMode && <TransactionsForm/>}

      <TransactionList/>

      {/*TODO: temp*/}
      <Button onClick={clearHandler}>clear all transactions</Button>
      <Button onClick={importHandler}>import transactions</Button>
      <Button onClick={exportHandler}>export transactions</Button>

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
