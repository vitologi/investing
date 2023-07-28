import {observer} from "mobx-react-lite";
import {Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {FormattedMessage} from "react-intl";
import {useManualStore} from "../../store/manual.selector";
import {useCallback} from "react";
import {SelectSwitcher} from "../../../intl/containers/select-switcher/select-switcher";
import {useTransactionsTransferStore} from "../../../transactions/store/transactions-transfer.selector";
import {ImportFormat} from "../../../transactions/shared/enums/import-format";
import {useIntlStore} from "../../../intl/store/intl.selector";
import {useCurrenciesStore} from "../../../currencies/store/currencies.selector";
import {CurrencyRateProvider} from "../../../currencies/shared/enums/currency-rate-provider";

export const DemoDialog = observer(() => {
  const store = useManualStore();
  const transferStore = useTransactionsTransferStore();
  const intlStore = useIntlStore();
  const currenciesStore = useCurrenciesStore();

  const acceptDemoDataHandler = useCallback(async () => {

    const mocks = await import('../../shared/mocks/transaction.mocks');
    try {
      await transferStore.importTransactions({format: ImportFormat.CSV, data: mocks.default});
      // TODO: implement notification
      alert(intlStore.formatMessage("app.common.actions.success"));
      store.closeDemoDialog();

      // TODO: temp values
      currenciesStore.setRateProvider(CurrencyRateProvider.Openexchangerates);
      currenciesStore.setOpenExchangeRatesApiToken('adbf602f8d4a4e71902d6da14647a470');
    } catch (e) {
      alert(intlStore.formatMessage("app.common.actions.error"));
    }
  }, [store, intlStore, transferStore, currenciesStore]);

  return (
    <Dialog
      open={store.isDemoDialogOpened}
      onClose={store.closeDemoDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <FormattedMessage id={"app.manual.demoDialog.title"}/>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <FormattedMessage id={"app.manual.demoDialog.content"}/>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Box sx={{mr: 'auto'}}>
          <SelectSwitcher size={"small"}/>
        </Box>

        <Button onClick={store.closeDemoDialog}>
          <FormattedMessage id={"app.common.actions.reject"}/>
        </Button>
        <Button onClick={acceptDemoDataHandler}>
          <FormattedMessage id={"app.common.actions.confirm"}/>
        </Button>
      </DialogActions>
    </Dialog>
  );
});
