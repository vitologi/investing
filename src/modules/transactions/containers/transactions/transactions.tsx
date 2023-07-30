import {observer} from "mobx-react-lite";
import {TransactionList} from "../transaction-list/transaction-list";
import {TransactionsForm} from "../transaction-form/transactions-form";
import {ChangeTransactionsPortfolio} from "../change-transactions-portfolio/change-transactions-portfolio";
import {Navigate, Route, Routes} from "react-router-dom";
import {Titled} from "../../../navigation/containers/titled/titled";

export const Transactions = observer(() => {
  return (
    <Routes>
      <Route index={true} element={<TransactionList/>}/>
      <Route
        path={'change-portfolio'}
        element={<Titled title="app.transactions.title.changePortfolio"><ChangeTransactionsPortfolio/></Titled>}
      />
      <Route
        path={'new'}
        element={<Titled title="app.transactions.title.add"><TransactionsForm/></Titled>}
      />
      <Route
        path={':id'}
        element={<Titled title="app.transactions.title.edit"><TransactionsForm/></Titled>}
      />
      <Route path={"*"} element={<Navigate to={'..'}/>}/>
    </Routes>
  );
})
