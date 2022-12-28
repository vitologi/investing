import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListSubheader,
} from '@mui/material';
import {  LocalHospital as LocalHospitalIcon,} from '@mui/icons-material';
import {observer} from 'mobx-react-lite';
import {Link} from 'react-router-dom';

import {LanguageSwitcher} from '../../../intl';
import {DrawerItem} from '../../components/drawer-item/drawer-item';
import {useDrawersPanelStore} from '../../store/drawers-panel.selector';
import {useNavigationPanelStore} from '../../store/navigation-panel.selector';

export const DrawersPanel = observer(() => {
  const store = useDrawersPanelStore();
  const navigationStore = useNavigationPanelStore();
  const includeCurrentRoute = (route: string): boolean => navigationStore.path.startsWith(route);
  const getGroupColor = (route: string): 'inherit' | 'primary' => (includeCurrentRoute(route) ? 'primary' : 'inherit');

  // TODO: integrate route active link
  const header = (
    <ListSubheader component="div" id="nested-list-subheader">
      <IconButton
        component={Link}
        to="dashboard"
        color={getGroupColor('/dashboard')}
        size="large">
        <LocalHospitalIcon />
      </IconButton>

      <IconButton
        component={Link}
        to="dictionaries"
        color={getGroupColor('/dictionaries')}
        size="large">
        <LocalHospitalIcon />
      </IconButton>

      <IconButton
        component={Link}
        to="dashboard"
        color={getGroupColor('/dashboard')}
        size="large">
        <LocalHospitalIcon />
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
          {includeCurrentRoute('/dashboard') && (
            <>

            </>
          )}

          {includeCurrentRoute('/dictionaries') && (
            <>
              <DrawerItem url="dictionaries/asset-types" name="app.titles.error" />
              <DrawerItem url="dictionaries/currencies" name="app.titles.error" />
              <DrawerItem url="dictionaries/exchanges" name="app.titles.error" />
              <DrawerItem url="dictionaries/portfolios" name="app.titles.error" />
            </>
          )}


        </List>

        <Divider />

        <LanguageSwitcher />
      </Box>
    </Drawer>
  );
});
