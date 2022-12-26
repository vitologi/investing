import {observer} from 'mobx-react-lite';
import {PropsWithChildren} from 'react';
import {IntlProvider} from 'react-intl';

import {useIntlStore} from '../../store/intl.selector';

export const IntlProviderWrapper = observer((props: PropsWithChildren<unknown>): JSX.Element => {
  const {children} = props;
  const store = useIntlStore();

  return (
    <IntlProvider
      locale={store.locale}
      messages={store.appLocale}
      defaultLocale="en"
    >
      {children}
    </IntlProvider>
  );
});
