import {AppBar, Box, IconButton, Toolbar} from '@mui/material';
import {
  AccountCircle as AccountCircleIcon,
  Menu as MenuIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';
import {observer} from 'mobx-react-lite';
import {NavLink} from 'react-router-dom';

import {MobileMenu} from '../../components/mobile-menu/mobile-menu';
import {useNavigationPanelStore} from '../../store/navigation-panel.selector';

export const NavigationPanel = observer((): JSX.Element => {
  const store = useNavigationPanelStore();

  return (
    <Box sx={{flexGrow: 1}}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            sx={{mr: 2}}
            color="inherit"
            aria-label="Open drawer"
            onClick={store.toggleDrawer.bind(store)}
            size="large">
            <MenuIcon />
          </IconButton>

          {/* LOGO */}
          {/* <Typography sx={{display: {xs: 'none', sm: 'block'}}} variant="h6" noWrap> */}
          {/*  Material-UI */}
          {/* </Typography> */}

          {/* SEARCH */}
          {/* <Box sx={(theme: Theme)=>{
            position: 'relative',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: alpha(theme.palette.common.white, 0.15), // TODO: explore theme.palette.action.selectedOpacity
            '&:hover': {
              backgroundColor: alpha(theme.palette.common.white, 0.25), // TODO: explore theme.palette.action.selectedOpacity
            },
            marginRight: theme.spacing(2),
            marginLeft: 0,
            width: '100%',
            [theme.breakpoints.up('sm')]: {
              marginLeft: theme.spacing(3),
              width: 'auto',
            },
          }}
          > */}
          {/*  <Box sx={(theme: Theme)=>({
            width: theme.spacing(7),
            height: '100%',
            position: 'absolute',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          })}> */}
          {/*    <SearchIcon/> */}
          {/*  </Box> */}
          {/*  <InputBase */}
          {/*    placeholder="Search…" */}
          {/*    classes={{ */}
          {/*      root: classes.inputRoot, */}
          {/*      input: classes.inputInput, */}

          {/*inputRoot: {*/}
          {/*  color: 'inherit',*/}
          {/*},*/}
          {/*  inputInput: {*/}
          {/*  padding: theme.spacing(1, 1, 1, 7),*/}
          {/*  transition: theme.transitions.create('width'),*/}
          {/*  width: '100%',*/}
          {/*  [theme.breakpoints.up('md')]: {*/}
          {/*  width: 200,*/}
          {/*},*/}
          {/*},*/}

          {/*    }} */}
          {/*    inputProps={{'aria-label': 'Search'}} */}
          {/*  /> */}
          {/* </Box> */}

          <Box sx={{flexGrow: 1}} />

          <Box sx={{display: {xs: 'none', md: 'flex'}}}>

            {/* MESSAGES */}
            {/* <IconButton aria-label="Show 4 new mails" color="inherit"> */}
            {/*  <Badge badgeContent={4} color="secondary"> */}
            {/*    <MailIcon/> */}
            {/*  </Badge> */}
            {/* </IconButton> */}

            {/* NOTIFICATION */}
            {/* <IconButton aria-label="Show 17 new notifications" color="inherit"> */}
            {/*  <Badge badgeContent={17} color="secondary"> */}
            {/*    <NotificationsIcon/> */}
            {/*  </Badge> */}
            {/* </IconButton> */}

            <NavLink to="profile" style={{textDecoration: 'none', color: 'white'}}>
              <IconButton
                edge="end"
                aria-label="Account of current user"
                aria-controls="account-menu"
                aria-haspopup="true"
                color="inherit"
                size="large">
                <AccountCircleIcon />
              </IconButton>
            </NavLink>

          </Box>

          <Box sx={{display: {xs: 'flex', md: 'none'}}}>
            <IconButton
              id="mobile-menu-anchor-id"
              aria-label="Show more"
              aria-controls="mobile-account-menu"
              aria-haspopup="true"
              onClick={store.toggleOpen.bind(store)}
              color="inherit"
              size="large">
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <MobileMenu
        id="mobile-menu"
        isOpen={store.isOpen}
        anchorElement={document.getElementById('mobile-menu-anchor-id')}
        closeHandler={store.toggleOpen.bind(store)}
      />
    </Box>
  );
});
