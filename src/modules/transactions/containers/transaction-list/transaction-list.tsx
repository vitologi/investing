import {observer} from "mobx-react-lite";
import {useTransactionsStore} from "../../store/transactions.selector";
import {TransactionItem} from "../transaction-item/transaction-item";
import {Stack} from "@mui/material";

export const TransactionList = observer(() => {
  const store = useTransactionsStore();

  return (
    <Stack p={2} spacing={2} >
      {store.list.map((item) => (<TransactionItem key={item.id} model={item}/>))}
    </Stack>
  );
})
