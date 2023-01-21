import {observer} from 'mobx-react-lite';
import {Routes, Route} from 'react-router-dom';

import {Titled} from '../../../navigation/containers/titled/titled';
import {AssetTypes} from "../../../asset-types/containers/asset-types/asset-types";
import {Currencies} from "../../../currencies/containers/currencies/currencies";
import {Exchanges} from "../../../exchanges/containers/exchanges/exchanges";
import {Portfolios} from "../../../portfolios/containers/portfolios/portfolios";

const Dictionaries = observer((): JSX.Element => {
  return (
    <Routes>
      <Route path="portfolios/*" element={<Titled title="app.titles.portfolios"><Portfolios /></Titled>} />
      <Route path="currencies/*" element={<Titled title="app.titles.currencies"><Currencies /></Titled>} />
      <Route path="exchanges/*" element={<Titled title="app.titles.exchanges"><Exchanges /></Titled>} />
      <Route path="asset-types/*" element={<Titled title="app.titles.assetTypes"><AssetTypes /></Titled>} />
    </Routes>
  );
});

export default Dictionaries
