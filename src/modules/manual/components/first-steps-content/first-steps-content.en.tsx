import * as React from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid2 from "@mui/material/Unstable_Grid2";
import {useCallback} from "react";
import {ButtonGroup, IconButton, List, ListItem, ListItemText, Paper, Theme} from "@mui/material";
import {FileDownload as FileDownloadIcon} from '@mui/icons-material';
import dictionariesPNG from './images/dictionaries.en.png';
import currencyRateProviderPNG from './images/currency-rate-provider.en.png';
import settingsTransactionsPNG from './images/settings-transactions.en.png';
import transactionAddPNG from './images/transaction-add.en.png';
import {saveAs} from "file-saver";
import {observer} from "mobx-react-lite";
import {FormattedMessage} from "react-intl";
import {CurrencyRateProvider} from "../../../currencies/shared/enums/currency-rate-provider";

export default observer(function VerticalLinearStepper(props: { onFinish: () => void }) {
  const {onFinish} = props;
  const [activeStep, setActiveStep] = React.useState(0);

  const NextButton = useCallback(() => (
    <Button
      variant="contained"
      onClick={() => setActiveStep((prevActiveStep) => prevActiveStep + 1)}
    > <FormattedMessage id={"app.common.actions.next"}/> </Button>
  ), [setActiveStep]);

  const BackButton = useCallback(() => (
    <Button
      onClick={() => setActiveStep((prevActiveStep) => prevActiveStep - 1)}
    ><FormattedMessage id={"app.common.actions.back"}/></Button>
  ), [setActiveStep]);

  const FinishButton = useCallback(() => (
    <Button
      variant="contained"
      onClick={onFinish}
    ><FormattedMessage id={"app.common.actions.finish"}/></Button>
  ), [onFinish]);

  const downloadMockTransactions = useCallback(async () => {
    const mocks = await import('../../shared/mocks/transaction.mocks');
    saveAs(new Blob([mocks.default], {type: "text/csv"}), 'transactions.csv');
  }, []);


  return (
    <Stepper activeStep={activeStep} orientation="vertical" sx={{margin: 2}}>

      {/*Dictionaries*/}
      <Step>
        <StepLabel>
          Dictionaries
        </StepLabel>
        <StepContent>
          <Grid2 data-testid="dictionaries-step" container={true} spacing={2}>
            <Grid2 xs={12} sm={4} sx={(theme: Theme) => ({
              [theme.breakpoints.down('sm')]: {
                textAlign: 'center',
                order: 1
              },
              order: 2,
              textAlign: 'end',
            })}>
              <Paper
                component={'img'}
                src={dictionariesPNG}
                alt="Dictionaries"
                sx={{
                  padding: 1,
                  width: 200,
                  height: 200,
                }}
              />
            </Grid2>
            <Grid2 xs={12} sm={8} sx={{order: 1}}>
              <Typography>
                To start working with the application, you need to fill out reference books (second menu tab):
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary={<FormattedMessage id={"app.titles.assetTypes"}/>}
                    secondary={"(stocks, bonds, currencies... real estate, gems)"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={<FormattedMessage id={"app.titles.currencies"}/>}
                    secondary={"(dollar, euro...)"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={<FormattedMessage id={"app.titles.exchanges"}/>}
                    secondary={"(Nasdaq, New York Stock Exchange...)"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={<FormattedMessage id={"app.titles.portfolios"}/>}
                    secondary={"(default - default portfolio)"}
                  />
                </ListItem>
              </List>
            </Grid2>


            <Grid2 xs={12} sx={{order: 2}}>
              <Typography>
                Filling in directories is intuitively clear by clicking on the add button and filling in the appropriate
                name. Some of the directories contain system values (which cannot be deleted), while others have a
                choice of values that will be used when working with the application.
              </Typography>
            </Grid2>


            <Grid2 xs={12} sx={{order: 2}}>
              <NextButton/>
            </Grid2>
          </Grid2>
        </StepContent>
      </Step>

      {/*Currency rate provider*/}
      <Step>
        <StepLabel>
          Choose a provider of currency quotes
        </StepLabel>
        <StepContent>
          <Grid2 data-testid="currency-step" container={true} spacing={2}>
            <Grid2 xs={12} sm={4} sx={(theme: Theme) => ({
              [theme.breakpoints.down('sm')]: {
                textAlign: 'center',
                order: 1
              },
              order: 2,
              textAlign: 'end',
            })}>
              <Paper
                component={'img'}
                src={currencyRateProviderPNG}
                alt="Currency rate provider settings"
                sx={{
                  padding: 1,
                  width: 300,
                  height: 300,
                }}
              />
            </Grid2>

            <Grid2 xs={12} sm={8} sx={{order: 1}}>
              <Typography>
                In the application, you can set the base currency, but in order for it to display values in it, you need
                to configure the currency pair provider. To do this, go to the settings section, select the required
                provider and set additional parameters (if required). For example, register on the site <a
                href={"https://openexchangerates.org/"} target={"_blank"}
                rel={"noreferrer"}>https://openexchangerates.org</a> get a secret code,
                select {CurrencyRateProvider.Openexchangerates} and click on the button <FormattedMessage
                id={"app.common.actions.save"}/>
              </Typography>
            </Grid2>

            <Grid2 xs={12} sx={{order: 2}}>
              <ButtonGroup>
                <NextButton/>
                <BackButton/>
              </ButtonGroup>
            </Grid2>
          </Grid2>
        </StepContent>
      </Step>

      {/*Settings transactions*/}
      <Step>
        <StepLabel>
          Transaction settings
        </StepLabel>
        <StepContent>
          <Grid2 data-testid="setting-transaction-step" container={true} spacing={2}>
            <Grid2 xs={12} sx={{textAlign: 'center'}}>
              <Paper
                component={'img'}
                src={settingsTransactionsPNG}
                alt="Transaction settings"
                sx={{
                  padding: 1,
                  width: "100%",
                  maxWidth: 500,
                  maxHeight: 250,
                }}
              />
            </Grid2>
            <Grid2 xs={12}>
              <Typography>
                Our app is based on transactions, which are recordings of every purchase or sale you make. This creates
                an accurate record of your financial activities. To begin, go to the general list of transactions and
                record your actions. You can save your transactions to a separate file and upload them as needed. If you
                only have a list of what you own, you can still balance your currencies with the <FormattedMessage
                id={"app.transactions.actions.adjustBalance"}/> option. We also provide an example of a transaction list
                you can download it here <IconButton onClick={downloadMockTransactions}><FileDownloadIcon/></IconButton>.
              </Typography>
            </Grid2>

            <Grid2 xs={12} sx={{order: 2}}>
              <ButtonGroup>
                <NextButton/>
                <BackButton/>
              </ButtonGroup>
            </Grid2>
          </Grid2>
        </StepContent>
      </Step>

      {/*Add transaction*/}
      <Step>
        <StepLabel optional={<Typography variant="caption">Last step</Typography>}>
          Adding a transaction
        </StepLabel>
        <StepContent>
          <Grid2 data-testid="transaction-step" container={true} spacing={2}>
            <Grid2 xs={12} sx={{textAlign: 'center'}}>
              <Paper
                component={'img'}
                src={transactionAddPNG}
                alt="Adding a transaction"
                sx={{
                  padding: 1,
                  width: "100%",
                  maxWidth: 500,
                  maxHeight: 300,
                }}
              />
            </Grid2>
            <Grid2 xs={12}>
              <Typography>
                Adding a transaction to our app is simple. Go to the transaction add form, which is easy to find in
                transactions page. Just enter the necessary information about your transaction, such as the date,
                amount, portfolio, asset . You can categorize the transaction by type, making it easier to track your
                financial activities. Start adding your transactions today and take control of your finances!
              </Typography>
            </Grid2>

            <Grid2 xs={12} sx={{order: 2}}>
              <ButtonGroup>
                <FinishButton/>
                <BackButton/>
              </ButtonGroup>
            </Grid2>
          </Grid2>
        </StepContent>
      </Step>
    </Stepper>
  );
});
