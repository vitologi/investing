import {observer} from "mobx-react-lite";
import {Fab, IconButton, List, ListItem, ListItemText} from "@mui/material";
import {FormattedMessage} from "react-intl";
import {Delete as DeleteIcon, Add as AddIcon} from "@mui/icons-material";
import {useAssetTypesStore} from "../../store/asset-types.selector";
import {useNavigate} from "react-router-dom";
import {useCallback} from "react";
import {useIntlStore} from "../../../intl/store/intl.selector";

export const AssetTypeList = observer(() => {
  const store = useAssetTypesStore();
  const navigate = useNavigate();
  const intlStore = useIntlStore();

  const onAdd = useCallback(() => navigate("new"), [navigate]);

  return (
    <>
      <List>
        {store.list.map((item) => (
          <ListItem
            secondaryAction={ !item.isSystem &&
              <IconButton
                onClick={() => item.delete()}
                edge="end"
                aria-label={intlStore.formatMessage("app.common.actions.delete")}
              >
                <DeleteIcon/>
              </IconButton>
            }
            key={item.id}
          >
            <ListItemText>
              {item.isSystem ? <FormattedMessage id={`app.assetTypes.type.${item.name}`}/> : item.name}
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
