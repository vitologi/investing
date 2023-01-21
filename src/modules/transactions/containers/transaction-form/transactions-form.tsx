import {Button, FormControl, FormHelperText, InputLabel, MenuItem, Paper, Select, TextField} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import {useCallback, useEffect} from "react";
import {useTransactionsStore} from "../../store/transactions.selector";
import {useIntlStore} from "../../../intl/store/intl.selector";
import {FormattedMessage} from "react-intl";
import {Observer, observer} from "mobx-react-lite";
import {TransactionAction} from "../../shared/enums/transaction-action";
import {useAssetTypesStore} from "../../../asset-types/store/asset-types.selector";
import {useCurrenciesStore} from "../../../currencies/store/currencies.selector";
import {usePortfoliosStore} from "../../../portfolios/store/portfolios.selector";
import {useExchangeStore} from "../../../exchanges/store/exchange.selector";
import Grid2 from "@mui/material/Unstable_Grid2";
import {DatePicker} from "@mui/x-date-pickers";
import {DevTool} from "@hookform/devtools";
import {IFormData} from "../../shared/interfaces/form-data";
import {dtoToFormData} from "../../shared/utils/dto-to-form-data";
import {formDataToDto} from "../../shared/utils/form-data-to-dto";
import {Transaction} from "../../shared/models/transaction";

// TODO: split form to multiple field components combined by grid
export const TransactionsForm = observer(() => {
  const store = useTransactionsStore();
  const assetTypeStore = useAssetTypesStore();
  const currencyStore = useCurrenciesStore();
  const portfolioStore = usePortfoliosStore();
  const exchangeStore = useExchangeStore();
  const intlStore = useIntlStore();

  const {control, handleSubmit, watch, resetField, reset} = useForm<IFormData>({
    mode: "onChange",
    defaultValues: dtoToFormData(store.createEmpty().asDto)
  });

  const saveHandler = useCallback(async (data: IFormData) => {
    const dto = formDataToDto(data);
    if (store.editedId) {
      await store.save(dto);
      store.clearTransaction();
    } else {
      await store.create(dto);
    }
    store.setDetailsMode(false);
  }, [store]);


  const assetTypeWatch = watch('assetType');
  useEffect(() => {
    if (assetTypeWatch !== '' || assetTypeStore.list.length === 0) {
      return;
    }

    resetField('assetType', {defaultValue: assetTypeStore.list[0].id});
  }, [resetField, assetTypeWatch, assetTypeStore.list, assetTypeStore.list.length]);


  // update edited model
  useEffect(() => {
    let item: Transaction | undefined;
    if (store.editedId) {
      item = store.item(store.editedId);
    }

    if (!item) {
      item = store.createEmpty();
    }

    reset(dtoToFormData(item.asDto));
  }, [store, reset, store.editedId]);

  return (
    <Paper sx={{m: 2, p: 2}}>

      {process.env.NODE_ENV === 'development' ? <DevTool control={control}/> : null}

      <Grid2
        component="form"
        onSubmit={handleSubmit(saveHandler)}
        container
        spacing={{xs: 2, md: 3}}
        columns={{xs: 4, sm: 8, md: 12}}
      >
        <Grid2 xs={2} sm={4} md={4}>
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

        <Grid2 xs={2} sm={4} md={4}>
          <Controller
            name={"assetType"}
            control={control}
            rules={{
              required: "app.common.form.rules.required",
            }}
            render={({field, fieldState: {error}}) => (
              <Observer>{() => (
                <FormControl fullWidth={true}>
                  <InputLabel id="asset-type-label">
                    <FormattedMessage id={"app.assetTypes.form.name"}/>
                  </InputLabel>

                  <Select
                    labelId="asset-type-label"
                    label={<FormattedMessage id={"app.assetTypes.form.name"}/>}
                    {...field}
                    error={!!error}
                  >
                    {assetTypeStore.list.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.isSystem ? <FormattedMessage id={`app.assetTypes.type.${item.name}`}/> : item.name}
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

        <Grid2 xs={2} sm={4} md={4}>
          <Controller
            name={"security"}
            control={control}
            rules={{
              required: "app.common.form.rules.required",
            }}
            render={({field, fieldState: {error}}) => (
              <Observer>{() => (
                <TextField
                  fullWidth={true}
                  {...field}
                  error={!!error}
                  label={intlStore.formatMessage("app.transactions.form.labels.security")}
                  helperText={<FormattedMessage id={error ? error.message : "app.empty"}/>}
                />
              )}</Observer>
            )}
          />
        </Grid2>

        <Grid2 xs={2} sm={4} md={4}>
          <Controller
            name={"action"}
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
                    {Object.values(TransactionAction).map((item) => (
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

        <Grid2 xs={2} sm={4} md={4}>
          <Controller
            name={"quantity"}
            control={control}
            rules={{
              required: "app.common.form.rules.required",
            }}
            render={({field, fieldState: {error}}) => (
              <TextField
                fullWidth={true}
                {...field}
                type={"number"}
                error={!!error}
                label={intlStore.formatMessage("app.transactions.form.labels.quantity")}
                helperText={<FormattedMessage id={error ? error.message : "app.empty"}/>}
              />
            )}
          />
        </Grid2>

        <Grid2 xs={2} sm={4} md={4}>
          <Controller
            name={"price"}
            control={control}
            rules={{
              required: "app.common.form.rules.required",
            }}
            render={({field, fieldState: {error}}) => (
              <TextField
                fullWidth={true}
                {...field}
                type={"number"}
                error={!!error}
                label={intlStore.formatMessage("app.transactions.form.labels.price")}
                helperText={<FormattedMessage id={error ? error.message : "app.empty"}/>}
              />
            )}
          />
        </Grid2>

        <Grid2 xs={2} sm={4} md={4}>
          <Controller
            name={"commission"}
            control={control}
            rules={{
              required: "app.common.form.rules.required",
            }}
            render={({field, fieldState: {error}}) => (
              <TextField
                fullWidth={true}
                {...field}
                type={"number"}
                error={!!error}
                label={intlStore.formatMessage("app.transactions.form.labels.commission")}
                helperText={<FormattedMessage id={error ? error.message : "app.empty"}/>}
              />
            )}
          />
        </Grid2>

        <Grid2 xs={2} sm={4} md={4}>
          <Controller
            name={"currency"}
            control={control}
            rules={{
              required: "app.common.form.rules.required",
            }}
            render={({field, fieldState: {error}}) => (
              <Observer>{() => (
                <FormControl fullWidth={true}>
                  <InputLabel id="currency-label">
                    <FormattedMessage id={"app.transactions.form.labels.currency"}/>
                  </InputLabel>

                  <Select
                    labelId="currency-label"
                    label={<FormattedMessage id={"app.transactions.form.labels.currency"}/>}
                    {...field}
                    error={!!error}
                  >
                    {currencyStore.enabledList.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        ({item.code}) {item.name}
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

        <Grid2 xs={2} sm={4} md={4}>
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

        <Grid2 xs={2} sm={4} md={8}>
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

        <Grid2 xs={4} sm={8} md={4}>
          <Button fullWidth={true} type="submit" sx={{p: 2}} color={"primary"} variant={"contained"}>
            <FormattedMessage id="app.common.actions.save"/>
          </Button>
        </Grid2>
      </Grid2>
    </Paper>
  );
});
