import {Button, FormControl, FormHelperText, InputLabel, MenuItem, Paper, Select, TextField} from "@mui/material";
import {Controller, FormProvider, useFieldArray, useForm} from "react-hook-form";
import {useCallback, useEffect, useMemo} from "react";
import {useTransactionsStore} from "../../store/transactions.selector";
import {useIntlStore} from "../../../intl/store/intl.selector";
import {FormattedMessage} from "react-intl";
import {Observer, observer} from "mobx-react-lite";
import {TransactionType} from "../../shared/enums/transaction-type";
import {usePortfoliosStore} from "../../../portfolios/store/portfolios.selector";
import {useExchangeStore} from "../../../exchanges/store/exchange.selector";
import Grid2 from "@mui/material/Unstable_Grid2";
import {DatePicker} from "@mui/x-date-pickers";
import {DevTool} from "@hookform/devtools";
import {IFormTransaction} from "../../shared/interfaces/form-transaction";
import {transactionDto2TransactionForm} from "../../shared/utils/transaction-dto-2-transaction-form";
import {formDataToDto} from "../../shared/utils/form-data-to-dto";
import {OperationType} from "../../shared/enums/operation-type";
import {ForwardOperation} from "../forward-operation/forward-operation";
import {BackwardOperation} from "../backward-operation/backward-operation";
import {CommissionOperation} from "../commission-operation/commission-operation";
import {getDefaultOperations} from "../../shared/utils/get-default-operations";
import {operationDto2OperationForm} from "../../shared/utils/operation-dto-2-operation-form";

interface IProps {
  id?: string | null;
}

export const TransactionsForm = observer(({id = null}: IProps) => {
  const store = useTransactionsStore();
  const portfolioStore = usePortfoliosStore();
  const exchangeStore = useExchangeStore();
  const intlStore = useIntlStore();
  const defaultValues = useMemo(
    () => {
      let item;
      if (id) {
        item = store.item(id);
      }
      return transactionDto2TransactionForm(item ? item.asDto : store.createEmpty().asDto);
    }
    , [id, store]);

  const methods = useForm<IFormTransaction>({
    mode: "onChange",
    defaultValues,

  });
  const {control, handleSubmit, watch, getFieldState, resetField} = methods;
  const {fields, remove, append} = useFieldArray({control, name: 'operations'})

  const saveHandler = useCallback(async (data: IFormTransaction) => {
    const dto = formDataToDto(data);
    if (store.editedId) {
      await store.save(dto);
      store.clearTransaction();
    } else {
      await store.create(dto);
    }
    store.setDetailsMode(false);
  }, [store]);


  // replace possible operations
  const typeWatch = watch('type');
  const {isDirty} = getFieldState('type');
  useEffect(() => {
    if (!typeWatch || !isDirty) {
      return;
    }
    // hack to prevent setting isDirty to false when value set back to initial
    resetField('type', {defaultValue: typeWatch});


    remove();
    append(getDefaultOperations(typeWatch).map(operationDto2OperationForm));
  }, [typeWatch, remove, append, isDirty, resetField]);

  return (
    <Paper sx={{m: 2, p: 2}}>

      {process.env.NODE_ENV === 'development' ? <DevTool control={control}/> : null}

      <FormProvider {...methods}>
        <Grid2
          component="form"
          onSubmit={handleSubmit(saveHandler)}
          container
          spacing={{xs: 2, md: 3}}
        >
          {/*date*/}
          <Grid2 xs={6} sm={4} md={4}>
            <Controller
              name={"date"}
              control={control}
              rules={{
                required: "app.common.form.rules.required",
                validate: (value) => (Date.parse(value) > 0)
              }}
              render={({field, fieldState: {error}}) => (
                <Observer>{() => (
                  <DatePicker
                    disableFuture={true}
                    label={intlStore.formatMessage("app.transactions.form.labels.date")}
                    openTo="day"
                    views={['year', 'month', 'day']}
                    renderInput={(params) => (
                      <TextField
                        fullWidth={true}
                        {...params}
                        error={!!error}
                        helperText={error && intlStore.formatMessage("app.common.form.rules.pattern")}
                      />
                    )}
                    {...field}
                  />
                )}</Observer>
              )
              }
            />
          </Grid2>

          {/*type*/}
          <Grid2 xs={6} sm={4} md={4}>
            <Controller
              name={"type"}
              control={control}
              rules={{
                required: "app.common.form.rules.required",
              }}
              render={({field, fieldState: {error}}) => (
                <Observer>{() => (
                  <FormControl fullWidth={true}>
                    <InputLabel id="action-label">
                      <FormattedMessage id={"app.transactions.form.labels.action"}/>
                    </InputLabel>

                    <Select
                      labelId="action-label"
                      label={<FormattedMessage id={"app.transactions.form.labels.action"}/>}
                      {...field}
                      error={!!error}
                    >
                      {Object.values(TransactionType).map((item) => (
                        <MenuItem key={item} value={item}>
                          <FormattedMessage id={`app.transactions.actions.${item}`}/>
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
          </Grid2>

          {/*portfolio*/}
          <Grid2 xs={6} sm={4} md={4}>
            <Controller
              name={"portfolio"}
              control={control}
              rules={{
                required: "app.common.form.rules.required",
              }}
              render={({field, fieldState: {error}}) => (
                <Observer>{() => (
                  <FormControl fullWidth={true}>
                    <InputLabel id="portfolio-label">
                      <FormattedMessage id={"app.transactions.form.labels.portfolio"}/>
                    </InputLabel>

                    <Select
                      labelId="portfolio-label"
                      label={<FormattedMessage id={"app.transactions.form.labels.portfolio"}/>}
                      {...field}
                      error={!!error}
                    >
                      {portfolioStore.list.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>

                    <FormHelperText error={true}>
                      <FormattedMessage id={error ? error.message : "app.empty"}/>
                    </FormHelperText>
                  </FormControl>
                )}</Observer>
              )}
            />
          </Grid2>

          {/*exchange*/}
          <Grid2 xs={6} sm={4} md={8}>
            <Controller
              name={"exchange"}
              control={control}
              render={({field, fieldState: {error}}) => (
                <Observer>{() => (
                  <FormControl fullWidth={true}>
                    <InputLabel id="exchange-label">
                      <FormattedMessage id={"app.transactions.form.labels.exchange"}/>
                    </InputLabel>

                    <Select
                      labelId="exchange-label"
                      label={<FormattedMessage id={"app.transactions.form.labels.exchange"}/>}
                      {...field}
                      error={!!error}
                    >
                      {exchangeStore.enabledList.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          ({item.mic}) {item.country}
                        </MenuItem>
                      ))}
                    </Select>

                    <FormHelperText error={true}>
                      <FormattedMessage id={error ? error.message : "app.empty"}/>
                    </FormHelperText>
                  </FormControl>
                )}</Observer>
              )}
            />
          </Grid2>

          {fields.map((field, index) => {
            switch (field.type) {
              case OperationType.Forward:
                return (<ForwardOperation key={field.id} index={index}/>);

              case OperationType.Backward:
                return (<BackwardOperation key={field.id} index={index}/>);

              case OperationType.Commission:
                return (<CommissionOperation key={field.id} index={index}/>);

              default:
                return null;
            }
          })}

          <Grid2 xs={12} sm={8} md={4}>
            <Button fullWidth={true} type="submit" sx={{p: 2}} color={"primary"} variant={"contained"}>
              <FormattedMessage id="app.common.actions.save"/>
            </Button>
          </Grid2>
        </Grid2>
      </FormProvider>
    </Paper>
  );
});
