import {observer} from 'mobx-react-lite';
import {PropsWithChildren} from 'react';
import {Helmet, HelmetProvider} from 'react-helmet-async';
import {useIntl} from 'react-intl';
import {useNavigationPanelStore} from '../../store/navigation-panel.selector';


// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const NavigationProviderWrapper = observer((props: PropsWithChildren<any>): JSX.Element => {
  const {children} = props;
  const {formatMessage} = useIntl();
  const navStore = useNavigationPanelStore();

  return (
    <HelmetProvider>
      <Helmet>
        <title>
          {formatMessage({id: navStore.title})}
        </title>
      </Helmet>
      {children}
    </HelmetProvider>
  );
});
