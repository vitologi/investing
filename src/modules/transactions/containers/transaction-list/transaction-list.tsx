import {observer} from "mobx-react-lite";
import {useTransactionsStore} from "../../store/transactions.selector";
import {TransactionItem} from "../transaction-item/transaction-item";
import {List, ListSubheader} from "@mui/material";
import {useIntlStore} from "../../../intl/store/intl.selector";
import {Fragment, useCallback, useEffect, useMemo, useState} from "react";

export const TransactionList = observer(() => {
  const store = useTransactionsStore();
  const intlStore = useIntlStore();
  let dateHeader = '';

  // TODO: move to single effect useVisibleItems(store.sortedList.length);
  const [visibleItems, setVisibleItems] = useState(10);
  const list = useMemo(() => store.sortedList.filter((_, index) => index <= visibleItems), [store.sortedList, visibleItems]);
  const handleScroll = useCallback(() => {
    if (visibleItems >= store.sortedList.length) {
      return;
    }

    if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight) {
      setVisibleItems((length) => length + 10);
    }

  }, [visibleItems, setVisibleItems, store.sortedList.length]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, {passive: true});

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <List dense={true}>
      {list.map((item) => {
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
