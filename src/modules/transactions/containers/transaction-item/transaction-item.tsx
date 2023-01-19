import {Transaction} from "../../shared/models/transaction";
import {
  Collapse, Divider,  IconButton, ListItem, ListItemAvatar,
  ListItemSecondaryAction, ListItemText,  Typography
} from "@mui/material";
import {Fragment, useCallback, useState} from "react";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  AccountBalance as AccountBalanceIcon,
  AttachMoney as AttachMoneyIcon,
  WorkOutline as WorkOutlineIcon,
  Receipt as ReceiptIcon,

} from '@mui/icons-material'
import {useIntlStore} from "../../../intl/store/intl.selector";
import {useTransactionsStore} from "../../store/transactions.selector";
import {observer} from "mobx-react-lite";
import {FormattedMessage} from "react-intl";
import {SystemAssetTypes} from "../../../asset-types/shared/enums/system-asset-types";
import {useCurrenciesStore} from "../../../currencies/store/currencies.selector";
import {usePortfoliosStore} from "../../../portfolios/store/portfolios.selector";

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

  const icon = useCallback((type: SystemAssetTypes) => {
    switch (type) {
      case SystemAssetTypes.CURRENCY:
        return <AttachMoneyIcon/>;

      case SystemAssetTypes.BOND:
      case SystemAssetTypes.EQUITY:
        return <ReceiptIcon/>;

      case SystemAssetTypes.FUTURE:
        return <AccountBalanceIcon/>;

      case SystemAssetTypes.MUTUALFUND:
      case SystemAssetTypes.ETF:
      default:
        return <WorkOutlineIcon/>
    }
  }, []);

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
          {icon(model.assetType as SystemAssetTypes)}
        </ListItemAvatar>
        <ListItemText
          primary={<FormattedMessage id={`app.transactions.actions.${model.action}`}/>}
          secondary={[model.security, ' (', portfolioStore.name(model.portfolio), ')'].join('')}
        />
        <ListItemText
          primary={`${model.isPositive ? '+' : '-'} ${model.total.toFixed(2)} ${model.currency}`}
          sx={{
            color: model.isPositive ? "success.main" : "error.main",
            flexGrow: 0,
          }}
        />
      </ListItem>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <ListItem>
          <ListItemText inset={true}>
            <Typography variant="body2" color="text.secondary">
              {[
                Number(model.quantity),
                ' x ',
                Number(model.price),
                currenciesStore.symbol(model.currency),
                ' + ',
                Number(model.commission),
                currenciesStore.symbol(model.currency),
              ].join('')}
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
