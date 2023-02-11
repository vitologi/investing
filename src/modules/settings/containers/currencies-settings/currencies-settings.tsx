import {Observer, observer} from "mobx-react-lite";
import {
  Card,
  CardHeader,
  CardContent,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem, FormHelperText, TextField, Button,
} from "@mui/material";
import {FormattedMessage} from "react-intl";
import {useCallback} from "react";
import {useCurrenciesStore} from "../../../currencies/store/currencies.selector";
import {CurrencyRateProvider} from "../../../currencies/shared/enums/currency-rate-provider";
import {Controller, useForm} from "react-hook-form";
import {useIntlStore} from "../../../intl/store/intl.selector";

interface ICurrenciesSettingsForm {
  rateProvider: CurrencyRateProvider;
  securityKey: string;
}

export const CurrenciesSettings = observer(() => {
  const intlStore = useIntlStore();
  const currencyStore = useCurrenciesStore();
  const {control, handleSubmit, watch} = useForm<ICurrenciesSettingsForm>({
    defaultValues: {rateProvider: currencyStore.rateProvider, securityKey: ''}
  })

  const saveHandler = useCallback((data: ICurrenciesSettingsForm) => {
    switch (data.rateProvider) {
      case CurrencyRateProvider.Openexchangerates:
      default:
        currencyStore.setRateProvider(data.rateProvider);
        currencyStore.setOpenExchangeRatesApiToken(data.securityKey);
        // TODO: implement success handler
        break;
    }
  }, [currencyStore]);

  const rateProvider = watch('rateProvider');

  return (
    <Card
      component="form"
      onSubmit={handleSubmit(saveHandler)}
      sx={{m: 1}}
    >
      <CardHeader title={<FormattedMessage id={"app.settings.titles.common"}/>}/>

      <CardContent>
        <Stack direction={"column"} spacing={2}>
          <Controller
            name={"rateProvider"}
            control={control}
            rules={{
              required: "app.common.form.rules.required",
            }}
            render={({field, fieldState: {error}}) => (
              <Observer>{() => (
                <FormControl fullWidth={true}>
                  <InputLabel id="rate-provider-label">
                    <FormattedMessage id={"app.settings.rateProvider"}/>
                  </InputLabel>

                  <Select
                    labelId="rate-provider-label"
                    label={<FormattedMessage id={"app.settings.rateProvider"}/>}
                    {...field}
                    error={!!error}
                  >
                    {Object.values(CurrencyRateProvider).map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
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

          {[CurrencyRateProvider.Openexchangerates].includes(rateProvider) && (
            <Controller
              name={'securityKey'}
              control={control}
              rules={{
                required: "app.common.form.rules.required",
              }}
              render={({field, fieldState: {error}}) => (
                <TextField
                  fullWidth={true}
                  {...field}
                  type={"text"}
                  error={!!error}
                  label={intlStore.formatMessage("app.settings.securityKey")}
                  helperText={<FormattedMessage id={error ? error.message : "app.empty"}/>}
                />
              )}
            />
          )}

          <Button fullWidth={true} type="submit" sx={{p: 2}} color={"primary"} variant={"contained"}>
            <FormattedMessage id="app.common.actions.save"/>
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
})
