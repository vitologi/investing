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
import {useState} from "react";
import {green, red} from "@mui/material/colors";
import {
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material'
import {useIntlStore} from "../../../intl/store/intl.selector";

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

export const TransactionItem = (props: IProps): JSX.Element => {
  const {model} = props;
  const intlStore = useIntlStore();

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

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
          <IconButton aria-label="add to favorites">
            <EditIcon/>
          </IconButton>
          <IconButton aria-label="share">
            <DeleteIcon/>
          </IconButton>
        </CardActions>
      </Collapse>
    </Card>
  );
}
