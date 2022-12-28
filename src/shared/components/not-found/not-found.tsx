import {FormattedMessage} from 'react-intl';
import {Link} from 'react-router-dom';
import {Box, Theme, Typography} from '@mui/material';

export function NotFound(): JSX.Element {
  return (
    <Box sx={(theme: Theme) => ({
      height: `calc(100vh - ${theme.spacing(8)})`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    })}>
      <Typography variant="body2">
        <FormattedMessage id="app.errors.404" />
      </Typography>

      <Link to="/">
        <Typography variant="body1" textAlign="center">
          <FormattedMessage id="app.errors.goHomeLink" />
        </Typography>
      </Link>
    </Box>
  );
}
