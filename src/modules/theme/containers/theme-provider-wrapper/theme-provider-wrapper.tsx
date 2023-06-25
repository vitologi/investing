import {ThemeProvider, StyledEngineProvider} from '@mui/material';
import {observer} from 'mobx-react-lite';
import {PropsWithChildren} from 'react';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';

import {useIntlStore} from '../../../intl/store/intl.selector';
import {useThemeStore} from '../../store/theme.selector';

export const ThemeProviderWrapper = observer((props: PropsWithChildren<unknown>): JSX.Element => {
  const {children} = props;
  const intlStore = useIntlStore();
  const themeStore = useThemeStore();

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themeStore.extendedTheme}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={intlStore.pickersLocale}>
          <StyledEngineProvider injectFirst>
            {children}
          </StyledEngineProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
});
