import {observer} from "mobx-react-lite";
import {PortfolioList} from "../portfolio-list/portfolio-list";
import {Route, Routes} from "react-router-dom";
import {Titled} from "../../../navigation/containers/titled/titled";
import {PortfolioForm} from "../portfolio-form/portfolio-form";
import {NotFound} from "../../../../shared/components/not-found/not-found";

export const Portfolios = observer(() => {

  return (
    <Routes>
      <Route
        index
        element={
          <Titled title="app.titles.error">
            <PortfolioList/>
          </Titled>
        }
      />

      <Route
        path="new/*"
        element={<Titled title="app.titles.error"><PortfolioForm/></Titled>}
      />

      <Route
        path="*"
        element={<Titled title="app.titles.error"> <NotFound/> </Titled>}
      />
    </Routes>
  );
})
