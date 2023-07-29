import {Route, Routes} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {Titled} from "../../../navigation/containers/titled/titled";
import {NotFound} from "../../../../shared/components/not-found/not-found";
import {EventList} from "../event-list/event-list";

export const Events = observer(():JSX.Element =>(
  <Routes>
    <Route index={true} element={
      <Titled title={"app.titles.events"}>
        <EventList/>
      </Titled>
    }/>

    <Route
      path="*"
      element={<Titled title="app.titles.error"> <NotFound/> </Titled>}
    />
  </Routes>
));
