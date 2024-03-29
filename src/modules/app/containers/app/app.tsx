import './app.css';
import {lazy, Suspense, useEffect} from "react";
import {
  NavigationProviderWrapper
} from "../../../navigation/containers/navigation-provider-wrapper/navigation-provider-wrapper";
import {Box, Theme} from "@mui/material";
import {DrawersPanel} from "../../../navigation/containers/drawers-panel/drawers-panel";
import {NavigationPanel} from "../../../navigation/containers/navigation-panel/navigation-panel";
import {Routes, Route, useNavigate} from "react-router-dom";
import {Titled} from "../../../navigation/containers/titled/titled";
import {observer} from "mobx-react-lite";
import {NotFound} from "../../../../shared/components/not-found/not-found";
import {Transactions} from "../../../transactions/containers/transactions/transactions";
import {Settings} from "../../../settings/containers/settings/settings";
import {Manual} from "../../../manual/containers/manual/manual";
import {useManualStore} from "../../../manual/store/manual.selector";
import {Events} from "../../../events/containers/events/events";

const Dictionaries = lazy(() => import("../../../dictionaries/containers/dictionaries/dictionaries"));
const Dashboard = lazy(() => import("../../../dashboard/containers/dashboard/dashboard"));

export const App = observer(() => {
  const manualStore = useManualStore();
  const navigate = useNavigate();

  useEffect(()=>{
    if(manualStore.isInit){
      return;
    }
    navigate('manual');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manualStore]);


  return (
    <NavigationProviderWrapper>
      <Box sx={{
        pb: {xs: 8, md: 0},
        minHeight: '100vh',
        backgroundColor: (theme: Theme)=>theme.palette.background.default,
      }}>
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
              element={<Titled title="app.titles.transactions">
                <Transactions/>
              </Titled>}
            />

            <Route
              path="settings/*"
              element={<Titled title="app.titles.settings">
                <Settings/>
              </Titled>}
            />

            <Route
              path="manual/*"
              // TODO: change manual title
              element={<Titled title="app.titles.settings">
                <Manual />
              </Titled>}
            />

            <Route
              path="events/*"
              element={<Titled title="app.titles.events">
                <Events />
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
