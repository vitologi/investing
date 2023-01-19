import {observer} from "mobx-react-lite";
import {useTransactionsStore} from "../../store/transactions.selector";
import {TransactionItem} from "../transaction-item/transaction-item";
import {List, ListSubheader} from "@mui/material";
import {useIntlStore} from "../../../intl/store/intl.selector";
import {Fragment} from "react";

export const TransactionList = observer(() => {
  const store = useTransactionsStore();
  const intlStore = useIntlStore();
  let dateHeader = '';

  return (
    <List dense={true}>
      {store.sortedList.map((item) => {
        let header = '';

        if (dateHeader !== item.date.toLocaleDateString(intlStore.locale)) {
          header = dateHeader = item.date.toLocaleDateString(intlStore.locale);
        }

        return (
          <Fragment key={item.id}>
            {header !== '' ? <ListSubheader>{header}</ListSubheader> : null}
            <TransactionItem model={item}/>
          </Fragment>
        );
      })}
    </List>
  );
});
