import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import {useCallback, useEffect, useState} from "react";
import {useTransactionsStore} from "../../store/transactions.selector";
import {useIntlStore} from "../../../intl/store/intl.selector";
import {FormattedMessage} from "react-intl";
import {Observer, observer} from "mobx-react-lite";
import {usePortfoliosStore} from "../../../portfolios/store/portfolios.selector";
import Grid from "@mui/material/Unstable_Grid2";
import {DatePicker} from "@mui/x-date-pickers";
import {DevTool} from "@hookform/devtools";
import {IFormChangePortfolio} from "../../shared/interfaces/form-change-portfolio";
import {format} from "date-fns";
import {Formats} from "../../../../shared/enums/formats";
import {DetailsLayout} from "../../../../shared/containers/details-layout/details-layout";
import {DetailsWrapper} from "../../../../shared/components/details-wrapper/details-wrapper";

export const ChangeTransactionsPortfolio = observer(() => {
  const transactionsStore = useTransactionsStore();
  const portfolioStore = usePortfoliosStore();
  const intlStore = useIntlStore();
  const [isProcessed, setIsProcessed] = useState<boolean>(false);

  const {control, handleSubmit, watch, trigger, formState: {isValid}} = useForm<IFormChangePortfolio>({
    mode: "onChange",
    defaultValues: {
      date: new Date(),
      from: '',
      to: '',
    },
  });

  const changePortfolioHandler = useCallback(async ({from, to, date}: IFormChangePortfolio) => {
    if (isProcessed) {
      return;
    }
    setIsProcessed(true);

    try {
      await transactionsStore.mergePortfolioTransactions({from, to, date});
      alert('Portfolio change was successful'); // TODO: change on notification store
    } catch (e) {
      alert('Something went wrong');
    }

    setIsProcessed(false);
  }, [transactionsStore, setIsProcessed, isProcessed]);

  const from = watch('from');
  const to = watch('to');

  useEffect(() => {
    trigger('to');
  }, [trigger, from]);

  useEffect(() => {
    trigger('from');
  }, [trigger, to]);

  return (
    <form onSubmit={handleSubmit(changePortfolioHandler)}>
      {process.env.NODE_ENV === 'development' ? <DevTool control={control}/> : null}

      <DetailsLayout
        actionTitle={"app.common.actions.save"}
        isActionDisabled={isProcessed || !isValid}
      >
        <DetailsWrapper>
          {/*date*/}
          <Grid xs={12} sm={12} md={4}>
            <Controller
              name={"date"}
              control={control}
              rules={{
                required: "app.common.form.rules.required",
                validate: (value: Date) => value > new Date() ? "app.common.form.rules.maxDate" : true
              }}
              render={({field, fieldState: {error}}) => (
                <Observer>{() => (
                  <DatePicker
                    disableFuture={true}
                    label={intlStore.formatMessage("app.events.changePortfolio.labels.eventDate")}
                    openTo="day"
                    views={['year', 'month', 'day']}
                    renderInput={(params) => (
                      <TextField
                        fullWidth={true}
                        {...params}
                        error={!!error}
                        helperText={error &&
                          <FormattedMessage id={error.message}
                                            values={{maxDate: format(new Date(), Formats.ISODate)}}/>}
                      />
                    )}
                    {...field}
                  />
                )}</Observer>
              )
              }
            />
          </Grid>

          {/* from portfolio */}
          <Grid xs={12} sm={6} md={4}>
            <Controller
              name={"from"}
              control={control}
              rules={{
                required: "app.common.form.rules.required",
                validate: (value: string) => to === value ? "app.events.changePortfolio.rules.same" : true,
              }}
              render={({field, fieldState: {error}}) => (
                <Observer>{() => (
                  <FormControl fullWidth={true}>
                    <InputLabel id="action-label">
                      <FormattedMessage id={"app.events.changePortfolio.labels.from"}/>
                    </InputLabel>

                    <Select
                      labelId="action-label"
                      label={<FormattedMessage id={"app.events.changePortfolio.labels.selectFrom"}/>}
                      {...field}
                      error={!!error}
                    >
                      {portfolioStore.list.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))
                      }
                    </Select>

                    <FormHelperText error={true}>
                      <FormattedMessage id={error ? error.message : "app.empty"}/>
                    </FormHelperText>
                  </FormControl>
                )}</Observer>
              )}
            />
          </Grid>

          {/* to portfolio */}
          <Grid xs={12} sm={6} md={4}>
            <Controller
              name={"to"}
              control={control}
              rules={{
                required: "app.common.form.rules.required",
                validate: (value: string) => from === value ? "app.events.changePortfolio.rules.same" : true,
              }}
              render={({field, fieldState: {error}}) => (
                <Observer>{() => (
                  <FormControl fullWidth={true}>
                    <InputLabel id="action-label">
                      <FormattedMessage id={"app.events.changePortfolio.labels.to"}/>
                    </InputLabel>

                    <Select
                      labelId="action-label"
                      label={<FormattedMessage id={"app.events.changePortfolio.labels.selectTo"}/>}
                      {...field}
                      error={!!error}
                    >
                      {portfolioStore.list.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))
                      }
                    </Select>

                    <FormHelperText error={true}>
                      <FormattedMessage id={error ? error.message : "app.empty"}/>
                    </FormHelperText>
                  </FormControl>
                )}</Observer>
              )}
            />
          </Grid>
        </DetailsWrapper>
      </DetailsLayout>
    </form>
  );
});
