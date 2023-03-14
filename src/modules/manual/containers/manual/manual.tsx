import {observer} from "mobx-react-lite";
import {Navigate, Route, Routes} from "react-router-dom";
import {Titled} from "../../../navigation/containers/titled/titled";
import {FirstSteps} from "../first-steps/first-steps";
import {createPortal} from "react-dom";
import {DemoDialog} from "../demo-dialog/demo-dialog";

export const Manual = observer((): JSX.Element => {
  return (
    <>
      {createPortal(<DemoDialog/>, document.body)}
      <Routes>
        <Route path="first-steps" element={<Titled title="app.titles.portfolios"><FirstSteps/></Titled>}/>
        <Route path="*" element={<Navigate to={'./first-steps'}/>}/>
      </Routes>
    </>
  );
});
