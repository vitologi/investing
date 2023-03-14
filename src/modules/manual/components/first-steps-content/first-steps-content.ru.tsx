import * as React from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid2 from "@mui/material/Unstable_Grid2";
import {useCallback} from "react";
import {saveAs} from "file-saver";
import {observer} from "mobx-react-lite";
import {FormattedMessage} from "react-intl";
import {ButtonGroup, IconButton, List, ListItem, ListItemText, Paper, Theme} from "@mui/material";
import {FileDownload as FileDownloadIcon} from '@mui/icons-material';
import dictionariesPNG from './images/dictionaries.ru.png';
import currencyRateProviderPNG from './images/currency-rate-provider.ru.png';
import settingsTransactionsPNG from './images/settings-transactions.ru.png';
import transactionAddPNG from './images/transaction-add.ru.png';
import {CurrencyRateProvider} from "../../../currencies/shared/enums/currency-rate-provider";

export default observer(function VerticalLinearStepper(props: { onFinish: () => void }) {
  const {onFinish} = props;
  const [activeStep, setActiveStep] = React.useState(0);

  const NextButton = useCallback(() => (
    <Button
      variant="contained"
      onClick={() => setActiveStep((prevActiveStep) => prevActiveStep + 1)}
    ><FormattedMessage id={"app.common.actions.next"}/></Button>
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
          Словари
        </StepLabel>
        <StepContent>
          <Grid2 container={true} spacing={2}>
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
                alt="Словари"
                sx={{
                  padding: 1,
                  width: 200,
                  height: 200,
                }}
              />
            </Grid2>
            <Grid2 xs={12} sm={8} sx={{order: 1}}>
              <Typography>
                Для начала работы с приложением требуется заполнить справочники (вторая вкладка меню):
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary={<FormattedMessage id={"app.titles.assetTypes"}/>}
                    secondary={"(акции, облигации, валюта... недвижимость, драгоценные камни)"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={<FormattedMessage id={"app.titles.currencies"}/>}
                    secondary={"(доллар, евро...)"}
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
                    secondary={"(default - портфель по умолчанию)"}
                  />
                </ListItem>
              </List>
            </Grid2>


            <Grid2 xs={12} sx={{order: 2}}>
              <Typography>
                Заполнение справочников происходит интуитивно понятно нажатием на кнопку добавить и заполнением
                соответствующего названия. В части справочников присутствуют системные значения (которые невозможно
                удалить), в части - доступен выбор значений, которые будут использоваться при работе с приложением.
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
          Выбрать провайдера котировок валют
        </StepLabel>
        <StepContent>
          <Grid2 container={true} spacing={2}>
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
                alt="Настройка провайдера курсов валют"
                sx={{
                  padding: 1,
                  width: 300,
                  height: 300,
                }}
              />
            </Grid2>
            <Grid2 xs={12} sm={8} sx={{order: 1}}>
              <Typography>
                В приложении можно выставить базовую валюту, но для того чтобы оно могло отображать значения в ней
                требуется настроить провайдера валютных пар. Для этого перейдите в раздел настроек, выберите нужного
                провайдера и задайте дополнительные параметры (если требуется). Например, зарегистрируйтесь на сайте <a
                href={"https://openexchangerates.org/"} target={"_blank"}
                rel={"noreferrer"}>https://openexchangerates.org</a> получите секретный код, выберите в настройках
                провайдера {CurrencyRateProvider.Openexchangerates} и нажмите на кнопку <FormattedMessage
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
          Настройки транзакций
        </StepLabel>
        <StepContent>
          <Grid2 container={true} spacing={2}>
            <Grid2 xs={12} sx={{textAlign: 'center'}}>
              <Paper
                component={'img'}
                src={settingsTransactionsPNG}
                alt="Настройки транзакций"
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
                Наше приложение основано на транзакциях, которые представляют собой записи каждой вашей покупки или
                продажи. Это создает точную запись вашей финансовой деятельности. Для начала зайдите в общий список
                транзакций и запишите свои действия. Вы можете сохранять свои транзакции в отдельный файл и загружать их
                по мере необходимости. Если у вас есть только список того, чем вы владеете, вы все равно можете
                сбалансировать свои валюты с помощью параметра <FormattedMessage
                id={"app.transactions.actions.adjustBalance"}/>. Мы также предоставляем пример списка транзакций,
                который вы можете скачать здесь <IconButton
                onClick={downloadMockTransactions}><FileDownloadIcon/></IconButton>.
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
        <StepLabel optional={<Typography variant="caption">Последний шаг</Typography>}>
          Добавление транзакции
        </StepLabel>
        <StepContent>
          <Grid2 container={true} spacing={2}>
            <Grid2 xs={12} sx={{textAlign: 'center'}}>
              <Paper
                component={'img'}
                src={transactionAddPNG}
                alt="Добавление транзакции"
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
                Добавить транзакцию в наше приложение очень просто. Перейдите к форме добавления транзакции, которую
                легко найти на странице транзакций. Просто введите необходимую информацию о вашей транзакции, такую как
                дата, сумма, портфель, актив. Вы можете классифицировать транзакцию по типу, что упрощает отслеживание
                вашей финансовой деятельности. Начните добавлять свои транзакции сегодня и возьмите под контроль свои
                финансы!
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
