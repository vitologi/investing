import {IconButton, Menu, MenuItem} from '@mui/material';
import {AccountCircle as AccountCircleIcon} from '@mui/icons-material';
import {MouseEvent} from 'react';
import {Link} from 'react-router-dom';

export const MobileMenu = (props: {
  id: string;
  isOpen: boolean;
  anchorElement: HTMLElement | null;
  closeHandler: (event: MouseEvent) => void;
}): JSX.Element => {
  const {
    id,
    isOpen,
    anchorElement,
    closeHandler,
  } = props;

  return (
    <Menu
      id={id}
      open={isOpen}
      anchorEl={anchorElement}
      anchorOrigin={{vertical: 'top', horizontal: 'right'}}
      keepMounted
      transformOrigin={{vertical: 'top', horizontal: 'right'}}
      onClose={closeHandler}
    >
      {/* MESSAGES */}
      {/* <MenuItem> */}
      {/*  <IconButton aria-label="Show 4 new mails" color="inherit"> */}
      {/*    <Badge badgeContent={4} color="secondary"> */}
      {/*      <MailIcon/> */}
      {/*    </Badge> */}
      {/*  </IconButton> */}
      {/*  <p>Messages</p> */}
      {/* </MenuItem> */}

      {/* NOTIFICATION */}
      {/* <MenuItem> */}
      {/*  <IconButton aria-label="Show 11 new notifications" color="inherit"> */}
      {/*    <Badge badgeContent={11} color="secondary"> */}
      {/*      <NotificationsIcon/> */}
      {/*    </Badge> */}
      {/*  </IconButton> */}
      {/*  <p>Notifications</p> */}
      {/* </MenuItem> */}

      <MenuItem
        component={Link}
        to="/profile"
        style={{textDecoration: 'none', color: 'inherit'}}
      >
        <IconButton
          aria-label="Account of current user"
          aria-haspopup="true"
          color="inherit"
          size="large">
          <AccountCircleIcon />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );
};
