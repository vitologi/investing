import {Transaction} from "../../shared/models/transaction";
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  IconButton, IconButtonProps, styled,
  Typography
} from "@mui/material";
import {useCallback, useState} from "react";
import {green, red} from "@mui/material/colors";
import {
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material'
import {useIntlStore} from "../../../intl/store/intl.selector";
import {useTransactionsStore} from "../../store/transactions.selector";
import {observer} from "mobx-react-lite";

interface IProps {
  model: Transaction;
}


interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const {expand: _, ...other} = props;
  return <IconButton {...other} />;
})(({theme, expand}) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export const TransactionItem = observer((props: IProps): JSX.Element => {
  const {model} = props;
  const intlStore = useIntlStore();
  const store = useTransactionsStore();

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
    <Card>
      <CardHeader
        avatar={
          <Avatar
            sx={{bgcolor: model.isPositive ? green[500] : red[500]}}
            aria-label={
              intlStore.formatMessage(
                model.isPositive ?
                  "app.transactions.item.avatarLabelAdd"
                  : "app.transactions.item.avatarLabelSubtract"
              )
            }
          >
            {model.isPositive ? <AddIcon/> : <RemoveIcon/>}
          </Avatar>
        }
        action={
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon/>
          </ExpandMore>
        }
        title={model.security}
        subheader={model.date.toDateString()}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography>
            {model.action}
            {model.portfolio}
            {model.currency}
            {model.assetType}
            {model.commission}
            {model.exchange}
            {model.price}
            {model.quantity}
          </Typography>
        </CardContent>

        <CardActions disableSpacing sx={{justifyContent: 'end'}}>
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
        </CardActions>
      </Collapse>
    </Card>
  );
});
