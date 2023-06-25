import {observer} from "mobx-react-lite";
import {Route, Routes} from "react-router-dom";
import {Titled} from "../../../navigation/containers/titled/titled";
import {PortfolioList} from "../portfolio-list/portfolio-list";
import {PortfolioForm} from "../portfolio-form/portfolio-form";
import {NotFound} from "../../../../shared/components/not-found/not-found";

export const Portfolios = observer(() => {

  return (
    <Routes>
      <Route
        index
        element={
          <Titled title="app.portfolios.title.list">
            <PortfolioList/>
          </Titled>
        }
      />

      <Route
        path="new/*"
        element={<Titled title="app.portfolios.title.new"><PortfolioForm/></Titled>}
      />

      <Route
        path="*"
        element={<Titled title="app.titles.error"> <NotFound/> </Titled>}
      />
    </Routes>
  );
})
