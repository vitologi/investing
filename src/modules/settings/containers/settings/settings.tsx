import {observer} from "mobx-react-lite";
import {Route, Routes, Navigate} from "react-router-dom";
import {TransactionSettings} from "../transaction-settings/transaction-settings";
import {CommonSettings} from "../common-settings/common-settings";
import {CurrenciesSettings} from "../currencies-settings/currencies-settings";

export const Settings = observer(() => {

  return (
    <Routes>
      <Route index element={<CommonSettings/>}/>
      <Route path={'currencies'} element={<CurrenciesSettings/>}/>
      <Route path={'transactions'} element={<TransactionSettings/>}/>
      <Route path={"*"} element={<Navigate to={'.'}/>}/>
    </Routes>
  );
})
