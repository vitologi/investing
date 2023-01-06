import {observer} from "mobx-react-lite";
import {Checkbox, List, ListItem, ListItemText, Typography} from "@mui/material";
import {useIntlStore} from "../../../intl/store/intl.selector";
import {useExchangeStore} from "../../store/exchange.selector";


export const Exchanges = observer(() => {
  const store = useExchangeStore();
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
                onChange={() => store.toggleEnabled(item.id)}
                checked={store.isEnabled(item.id)}
                inputProps={{'aria-label': `${intlStore.formatMessage("app.common.actions.select")} ${item.name}`}}
              />
            }
          >
            <ListItemText
              primary={
                <>
                  {item.mic}&nbsp;
                  <Typography component={'span'} variant={'body2'} color={"text.secondary"}>
                    ({item.country})
                  </Typography>
                </>
              }
              secondary={item.name}
            />
          </ListItem>
        ))}
      </List>
    </>
  );
});
