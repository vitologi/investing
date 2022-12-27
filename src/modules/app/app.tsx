import logo from './logo.svg';
import './app.css';
import {FormattedMessage} from "react-intl";
import {LanguageSwitcher} from "../intl";
import {useThemeStore} from "../theme/store/theme.selector";
import {useCallback} from "react";
import {Button} from "@mui/material";

export function App() {
  const themeStore = useThemeStore();
  const changeMainColor = useCallback(() => {
    themeStore.patchTheme({palette: {info: {main: "#FF0000"}}});
  }, [themeStore]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <p><FormattedMessage id={'app.titles.main'}/></p>
        <p> Translation <FormattedMessage id={'app.common.statuses.success'}/></p>

        <LanguageSwitcher/>
        <Button onClick={changeMainColor} color={"info"}>Change theme</Button>
      </header>
    </div>
  );
}
