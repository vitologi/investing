import {observer} from "mobx-react-lite";
import {Accordion, AccordionDetails, AccordionSummary, Box, Button, ButtonGroup, Typography} from "@mui/material";
import {ExpandMore as ExpandMoreIcon} from '@mui/icons-material';
import {FormattedMessage} from "react-intl";
import {useTransactionsTransferStore} from "../../../transactions/store/transactions-transfer.selector";
import {useCallback} from "react";

export const Settings = observer(() => {
  const transferStore = useTransactionsTransferStore();


  const clearHandler = useCallback(()=>transferStore.clearAllTransactions(), [transferStore]);
  const importHandler = useCallback(()=>transferStore.importTransactions(), [transferStore]);
  const exportHandler = useCallback(()=>transferStore.exportTransactions(), [transferStore]);

  return (
    <Box m={2}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography><FormattedMessage id={"app.titles.transactions"}/></Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ButtonGroup>
            <Button onClick={clearHandler}><FormattedMessage id={"app.transactions.actions.clearAll"}/></Button>
            <Button onClick={importHandler}><FormattedMessage id={"app.transactions.actions.import"}/></Button>
            <Button onClick={exportHandler}><FormattedMessage id={"app.transactions.actions.export"}/></Button>
          </ButtonGroup>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
})
