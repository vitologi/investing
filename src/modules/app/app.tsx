import logo from './logo.svg';
import './app.css';
import {FormattedMessage} from "react-intl";
import {LanguageSwitcher} from "../intl";

export function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <p><FormattedMessage id={'app.titles.main'}/></p>
        <p> Translation <FormattedMessage id={'app.common.statuses.success'}/></p>

        <LanguageSwitcher/>
      </header>
    </div>
  );
}
