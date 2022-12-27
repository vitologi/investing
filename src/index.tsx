import {StrictMode} from 'react';
import ReactDOM from 'react-dom/client';
import 'reflect-metadata';
import 'reset-css';
import './index.css';
import {App} from './modules/app/app';
import * as serviceWorkerRegistration from './modules/offline/service-worker-registrator';
import reportWebVitals from './reportWebVitals';
import {serviceWorkerConfig} from "./modules/offline/service-worker-config";
import {DiProvider} from "./shared/components/di/di.provider";
import {IntlProviderWrapper} from "./modules/intl";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {ThemeProviderWrapper} from "./modules/theme";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <DiProvider>
      <BrowserRouter>
        <ThemeProviderWrapper>
          <IntlProviderWrapper>
            <Routes>
              <Route path="*" element={<App/>}/>
            </Routes>
          </IntlProviderWrapper>
        </ThemeProviderWrapper>
      </BrowserRouter>
    </DiProvider>
  </StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register(serviceWorkerConfig);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
