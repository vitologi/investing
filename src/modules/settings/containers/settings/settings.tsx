import {observer} from "mobx-react-lite";
import {Route, Routes, Navigate} from "react-router-dom";
import {TransactionSettings} from "../transaction-settings/transaction-settings";

export const Settings = observer(() => {

  return (
    <Routes>
      <Route index={true} element={<TransactionSettings/>}/>
      <Route path={"*"} element={<Navigate to={'.'}/>}/>
    </Routes>
  );
})
