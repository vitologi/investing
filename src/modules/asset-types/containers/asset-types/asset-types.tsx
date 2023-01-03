import {observer} from "mobx-react-lite";
import {AssetTypeList} from "../asset-type-list/asset-type-list";
import {Route, Routes} from "react-router-dom";
import {Titled} from "../../../navigation/containers/titled/titled";
import {AssetTypeForm} from "../asset-type-form/asset-type-form";
import {NotFound} from "../../../../shared/components/not-found/not-found";

export const AssetTypes = observer(() => {

  return (
    <Routes>
      <Route
        index
        element={
          <Titled title="app.titles.error">
            <AssetTypeList/>
          </Titled>
        }
      />

      <Route
        path="new/*"
        element={<Titled title="app.titles.error"><AssetTypeForm/></Titled>}
      />

      <Route
        path="*"
        element={<Titled title="app.titles.error"> <NotFound/> </Titled>}
      />
    </Routes>
  );
})
