import {Checkbox, TableCell, TableRow, Tooltip} from "@mui/material";
import {format} from "date-fns";
import {Formats} from "../../../../shared/enums/formats";
import {ChangeCircle as ChangeCircleIcon} from "@mui/icons-material";
import {useEventsStore} from "../../store/events.selector";
import {FormattedMessage} from "react-intl";
import {useTransactionsStore} from "../../../transactions/store/transactions.selector";
import {usePortfoliosStore} from "../../../portfolios/store/portfolios.selector";
import {observer} from "mobx-react-lite";
import {
  ITransferBetweenPortfolioPayloadDto
} from "../../../transactions/shared/dtos/transfer-between-portfolio-payload.dto";
import {IBaseEventDto} from "../../shared/dtos/base-event.dto";
import {useCallback, useMemo} from "react";
import {TransferBetweenPortfolioCommand} from "../../../transactions/shared/models/transfer-between-portfolio.command";

interface IProps {
  model: IBaseEventDto<ITransferBetweenPortfolioPayloadDto>;
}

export const ChangePortfolioRow = observer(({model}: IProps): JSX.Element => {
  const store = useEventsStore();
  const transactionsStore = useTransactionsStore();
  const portfoliosStore = usePortfoliosStore();
  const {_id: id, payload: {transactionId, oldPortfolioId, newPortfolioId}} = model;

  // TODO: put constructor into handler in favor of performance
  const command = useMemo(() => new TransferBetweenPortfolioCommand(
    {
      broker: transactionsStore,
      eventDto: model
    }
  ), [transactionsStore, model]);

  const transaction = transactionsStore.item(transactionId);
  const oldPortfolio = portfoliosStore.item(oldPortfolioId);
  const newPortfolio = portfoliosStore.item(newPortfolioId);

  const handleSelect = useCallback(() => store.select(id, command), [store, command, id]);

  if (!(transaction && oldPortfolio && newPortfolio)) {
    return <></>;
  }

  return (
    <TableRow key={id}>
      <TableCell padding={"checkbox"}>
        <Checkbox
          color="primary"
          checked={store.selected.has(id)}
          onChange={handleSelect}
          inputProps={{
            'aria-label': 'select all desserts',
          }}
        />
      </TableCell>

      <TableCell align={'center'}>
        <Tooltip title={<FormattedMessage id={"app.events.list.changePortfolio.tooltip"}/>}>
          <ChangeCircleIcon/>
        </Tooltip>
      </TableCell>

      <TableCell>
        {format(transaction.date, Formats.ISODate)}
      </TableCell>

      <TableCell>
        <FormattedMessage
          id={"app.events.list.changePortfolio.details"}
          values={{
            asset: transaction.security,
            oldName: oldPortfolio.name,
            newName: newPortfolio.name,
          }}
        />
      </TableCell>
    </TableRow>
  );
});
