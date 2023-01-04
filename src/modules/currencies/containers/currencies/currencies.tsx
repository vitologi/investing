import {observer} from "mobx-react-lite";
import {Avatar, Checkbox, List, ListItem, ListItemAvatar, ListItemText} from "@mui/material";
import {useCurrenciesStore} from "../../store/currencies.selector";
import {useIntlStore} from "../../../intl/store/intl.selector";


export const Currencies = observer(() => {
  const store = useCurrenciesStore();
  const intlStore = useIntlStore();

  return (
    <>
      <List>
        {store.sortedByEnablingList.map((item) => (
          <ListItem
            key={item.id}
            secondaryAction={
              <Checkbox
                edge="end"
                onChange={()=>store.toggleEnabled(item.id)}
                checked={store.isEnabled(item.id)}
                inputProps={{ 'aria-label': `${intlStore.formatMessage("app.common.actions.select")} ${item.name}` }}
              />
            }
          >
            <ListItemAvatar>
              <Avatar>
                {item.symbol_native}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={item.code} secondary={item.name} />
          </ListItem>
        ))}
      </List>
    </>
  );
})
