import {List, ListItemButton, ListItemText} from '@mui/material';
import {observer} from 'mobx-react-lite';
import {useIntlStore} from '../../store/intl.selector';

export const LanguageSwitcher = observer(() => {
  const store = useIntlStore();

  return  (
    <List>
      <ListItemButton onClick={store.switchToEnglish.bind(store)} key="switchToEnglish">
        <ListItemText primary="English" />
      </ListItemButton>

      <ListItemButton onClick={store.switchToRussian.bind(store)} key="switchToRussian">
        <ListItemText primary="Русский" />
      </ListItemButton>
    </List>
  );
});
