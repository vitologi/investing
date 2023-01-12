import './app.css';
import {lazy, Suspense} from "react";
import {
  NavigationProviderWrapper
} from "../../../navigation/containers/navigation-provider-wrapper/navigation-provider-wrapper";
import {Box} from "@mui/material";
import {DrawersPanel} from "../../../navigation/containers/drawers-panel/drawers-panel";
import {NavigationPanel} from "../../../navigation/containers/navigation-panel/navigation-panel";
import {Routes, Route} from "react-router-dom";
import {Titled} from "../../../navigation/containers/titled/titled";
import {observer} from "mobx-react-lite";
import {NotFound} from "../../../../shared/components/not-found/not-found";
import {Transactions} from "../../../transactions/containers/transactions/transactions";

const Dictionaries = lazy(() => import("../../../dictionaries/containers/dictionaries/dictionaries"));
const Dashboard = lazy(() => import("../../../dashboard/containers/dashboard/dashboard"));

export const App = observer(() => {

  return (
    <NavigationProviderWrapper>
      <Box sx={{pb: {xs: 8, md: 0}}}>
        <DrawersPanel/>

        <NavigationPanel/>

        {/* TODO: need create loading component */}
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route
              index
              element={<Titled title="app.titles.main"> <Dashboard/> </Titled>}
            />

            <Route
              path="dictionaries/*"
              element={<Titled title="app.titles.dictionaries">
                <Dictionaries/>
              </Titled>}
            />

            <Route
              path="transactions/*"
              element={<Titled title="app.titles.error">
                <Transactions/>
              </Titled>}
            />

            <Route
              path="*"
              element={<Titled title="app.titles.error">
                <NotFound/>
              </Titled>}
            />
          </Routes>
        </Suspense>
      </Box>
    </NavigationProviderWrapper>
  );
});
