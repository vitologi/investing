import {Transaction} from "../../shared/models/transaction";
import {
  Collapse,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography
} from "@mui/material";
import {Fragment, useCallback, useState} from "react";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material'
import {useIntlStore} from "../../../intl/store/intl.selector";
import {useTransactionsStore} from "../../store/transactions.selector";
import {observer} from "mobx-react-lite";
import {FormattedMessage} from "react-intl";
import {useCurrenciesStore} from "../../../currencies/store/currencies.selector";
import {usePortfoliosStore} from "../../../portfolios/store/portfolios.selector";
import {isPositive} from "../../shared/utils/is-positive";
import {TransactionType} from "../../shared/enums/transaction-type";
import {AssetTypeIcon} from "../../../asset-types/components/asset-type-icon/asset-type-icon";

interface IProps {
  model: Transaction;
}

export const TransactionItem = observer((props: IProps): JSX.Element => {
  const {model} = props;
  const intlStore = useIntlStore();
  const store = useTransactionsStore();
  const currenciesStore = useCurrenciesStore();
  const portfolioStore = usePortfoliosStore();

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const editHandler = useCallback(() => {
    store.chooseTransaction(model);
    store.setDetailsMode(true);
  }, [store, model]);

  const deleteHandler = useCallback(() => {
    store.delete(model.asDto);
    store.setDetailsMode(false);
  }, [store, model.asDto]);


  return (
    <Fragment>
      <ListItem>
        <ListItemAvatar
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label={intlStore.formatMessage("app.empty")}
          sx={{flexGrow: 0}}
        >
          <AssetTypeIcon type={model.assetType} />
        </ListItemAvatar>
        <ListItemText
          primary={<FormattedMessage id={`app.transactions.actions.${model.type}`}/>}
          secondary={`${model.security} (${portfolioStore.name(model.portfolio)})`}
        />
        <ListItemText
          primary={`${isPositive(model.total) ? '+' : ''}${model.total.toFixed(2)} ${model.currency}`}
          sx={{
            color: isPositive(model.total) ? "success.main" : "error.main",
            flexGrow: 0,
          }}
        />
      </ListItem>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <ListItem>
          <ListItemText inset={true}>
            <Typography variant="body2" color="text.secondary">
              {[TransactionType.Buy, TransactionType.Sell].includes(model.type) && (
                [

                  Number(model.quantity),
                  ' x ',
                  Number(model.price),
                  currenciesStore.symbol(model.currency),
                  ' + ',
                  Number(model.commission?.amount),
                  currenciesStore.symbol(model.currency),
                ].join('')
              )}
            </Typography>
          </ListItemText>
          <ListItemSecondaryAction>
            <IconButton
              onClick={editHandler}
              aria-label={intlStore.formatMessage("app.common.actions.edit")}
            >
              <EditIcon/>
            </IconButton>

            <IconButton
              onClick={deleteHandler}
              aria-label={intlStore.formatMessage("app.common.actions.delete")}
            >
              <DeleteIcon/>
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <Divider/>
      </Collapse>
    </Fragment>
  );
});
