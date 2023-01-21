import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListSubheader,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  LocalLibrary as LocalLibraryIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import {observer} from 'mobx-react-lite';
import {Link} from 'react-router-dom';

import {LanguageSwitcher} from '../../../intl';
import {DrawerItem} from '../../components/drawer-item/drawer-item';
import {useDrawersPanelStore} from '../../store/drawers-panel.selector';
import {useNavigationPanelStore} from '../../store/navigation-panel.selector';
import {useCallback} from "react";

export const DrawersPanel = observer(() => {
  const store = useDrawersPanelStore();
  const navigationStore = useNavigationPanelStore();

  const includeCurrentRoute = useCallback(
    (route: string): boolean => navigationStore.path.startsWith(route),
    [navigationStore]
  );

  const getGroupColor = useCallback((routes: string[]): 'inherit' | 'primary' => {
    for (const route of routes) {
      if (
        navigationStore.path === route
        || route !== '/' && includeCurrentRoute(route)
      ) {
        return 'primary';
      }
    }

    return 'inherit';
  }, [navigationStore, includeCurrentRoute]);

  // TODO: integrate route active link
  const header = (
    <ListSubheader component="div" id="nested-list-subheader">
      <IconButton
        component={Link}
        to="/"
        color={getGroupColor(['/', '/transactions'])}
        size="large">
        <DashboardIcon/>
      </IconButton>

      <IconButton
        component={Link}
        to="dictionaries"
        color={getGroupColor(['/dictionaries'])}
        size="large">
        <LocalLibraryIcon/>
      </IconButton>

      <IconButton
        component={Link}
        to="settings"
        color={getGroupColor(['/settings'])}
        size="large">
        <SettingsIcon/>
      </IconButton>
    </ListSubheader>
  );

  return (
    <Drawer open={store.isOpen} onClose={store.toggleOpen.bind(store)}>
      <Box
        sx={{
          width: '100%',
          maxWidth: 360,
          backgroundColor: 'background.paper',
        }}
        role="presentation"
      >
        <List
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={header}
          sx={{
            width: '100%',
            maxWidth: 360,
            backgroundColor: 'background.paper',
          }}
        >

          {includeCurrentRoute('/dictionaries')
            ? (
              <>
                <DrawerItem url="dictionaries/asset-types" name="app.titles.assetTypes"/>
                <DrawerItem url="dictionaries/currencies" name="app.titles.currencies"/>
                <DrawerItem url="dictionaries/exchanges" name="app.titles.exchanges"/>
                <DrawerItem url="dictionaries/portfolios" name="app.titles.portfolios"/>
              </>
            )
            : (
              <>
                <DrawerItem url="/" name="app.titles.dashboard"/>
                <DrawerItem url="transactions" name="app.titles.transactions"/>
              </>
            )
          }


        </List>

        <Divider/>

        <LanguageSwitcher/>
      </Box>
    </Drawer>
  );
});
