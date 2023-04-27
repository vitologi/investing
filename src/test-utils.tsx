import {render as rtlRender} from '@testing-library/react'
import {IntlProvider} from 'react-intl'
import enTranslation from "./modules/intl/locale/en.json";
import {PropsWithChildren, ReactElement} from "react";

function render(ui: ReactElement, renderOptions = {}) {
  function Wrapper(props: PropsWithChildren) {
    return (<IntlProvider locale={'en'} messages={enTranslation}>{props.children}</IntlProvider>);
  }

  return rtlRender(ui, {wrapper: Wrapper, ...renderOptions})
}

// re-export everything
export * from '@testing-library/react'

// override render method
export {render}
