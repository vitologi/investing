import {observer} from "mobx-react-lite";
import {Fab, IconButton, List, ListItem, ListItemText} from "@mui/material";
import {Delete as DeleteIcon, Add as AddIcon} from "@mui/icons-material";
import {usePortfoliosStore} from "../../store/portfolios.selector";
import {useNavigate} from "react-router-dom";
import {useCallback} from "react";
import {useIntlStore} from "../../../intl/store/intl.selector";

export const PortfolioList = observer(() => {
  const store = usePortfoliosStore();
  const navigate = useNavigate();
  const intlStore = useIntlStore();

  const onAdd = useCallback(() => navigate("new"), [navigate]);

  return (
    <>
      <List>
        {store.list.map((item) => (
          <ListItem
            secondaryAction={
              <IconButton
                onClick={() => store.delete(item.asDto)}
                edge="end"
                aria-label={intlStore.formatMessage("app.common.actions.delete")}
              >
                <DeleteIcon/>
              </IconButton>
            }
            key={item.id}
          >
            <ListItemText>
              {item.name}
            </ListItemText>
          </ListItem>
        ))}
      </List>

      <Fab
        onClick={onAdd}
        sx={{position: 'absolute', bottom: 16, right: 16}}
        aria-label={intlStore.formatMessage("app.common.actions.add")}
        color="primary"
      >
        <AddIcon/>
      </Fab>
    </>
  );
})
