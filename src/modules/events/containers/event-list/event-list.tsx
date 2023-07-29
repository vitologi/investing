import {observer} from "mobx-react-lite";
import {useEventsStore} from "../../store/events.selector";
import {IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {EventType} from "../../shared/enums/event-type";
import {ChangePortfolioRow} from "../change-portfolio-row/change-portfolio-row";
import {FormattedMessage} from "react-intl";
import {useIntlStore} from "../../../intl/store/intl.selector";
import {Delete as DeleteIcon} from "@mui/icons-material";
import Grid from "@mui/material/Unstable_Grid2";
import {IBaseEventDto} from "../../shared/dtos/base-event.dto";
import {
  ITransferBetweenPortfolioPayloadDto
} from "../../../transactions/shared/dtos/transfer-between-portfolio-payload.dto";
import {useCallback, useEffect} from "react";
import {useCommandsStore} from "../../store/commands.selector";

export const EventList = observer(() => {
  const eventsStore = useEventsStore();
  const commandsStore = useCommandsStore();
  const intlStore = useIntlStore();

  // TODO: move method into event-view.store
  const revertSelectedEventsHandler = useCallback(async (): Promise<void> => {
    for (const command of Array.from(eventsStore.selected.values())) {
      try {
        await commandsStore.undoCommand(command);
      } catch (e) {
        console.log(e); // TODO: implement notification system
      }
    }
    await eventsStore.load();
    eventsStore.unselectAll();
  }, [eventsStore, commandsStore]);

  useEffect(()=>{
    if (eventsStore.isInit){
      return;
    }
    eventsStore.load();
  },[eventsStore]);

  return (
    <Grid container={true} justifyContent={"center"}>
      <Grid p={1}>
        <TableContainer component={Paper}>
          <Table size={'small'}>
            <TableHead>
              <TableRow>
                <TableCell padding={'checkbox'}>
                  {/*{store.selected.size}*/}
                  <IconButton
                    aria-label={intlStore.formatMessage("app.events.actions")}
                    size="small"
                    color={eventsStore.selected.size > 0 ? "primary" : "default"}
                    onClick={revertSelectedEventsHandler}
                  >
                    <DeleteIcon/>
                  </IconButton>
                </TableCell>
                <TableCell>
                  <FormattedMessage id={"app.events.list.columns.event"}/>
                </TableCell>
                <TableCell>
                  <FormattedMessage id={"app.events.list.columns.date"}/>
                </TableCell>
                <TableCell width={"100%"}>
                  <FormattedMessage id={"app.events.list.columns.details"}/>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {eventsStore.list.map((item) => {
                switch (item.type) {
                  case EventType.TransferBetweenPortfolio:
                    return (
                      <ChangePortfolioRow
                        key={item._id}
                        model={item as IBaseEventDto<ITransferBetweenPortfolioPayloadDto>}
                      />
                    );

                  case EventType.Unknown:
                  default:
                    return <></>;
                }
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
})
