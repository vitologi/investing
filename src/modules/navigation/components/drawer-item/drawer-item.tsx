import {ListItemButton, ListItemIcon, ListItemText} from '@mui/material';
import {PropsWithChildren} from 'react';
import {FormattedMessage} from 'react-intl';
import {Link} from 'react-router-dom';

export const DrawerItem = (props: PropsWithChildren<{
  url: string;
  name: string;
}>): JSX.Element => {
  const {url, name, children} = props;

  return (
    <ListItemButton
      component={Link}
      to={url}
      sx={{textDecoration: 'none'}}
    >
      {children && (
        <ListItemIcon>
          <>{children}</>
        </ListItemIcon>
      )}
      <ListItemText primary={<FormattedMessage id={name} />} />
    </ListItemButton>
  );
};
