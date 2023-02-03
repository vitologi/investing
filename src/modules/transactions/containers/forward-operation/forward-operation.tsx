import {Observer, observer} from "mobx-react-lite";
import {Controller, useFormContext} from "react-hook-form";
import {IFormTransaction} from "../../shared/interfaces/form-transaction";
import Grid2 from "@mui/material/Unstable_Grid2";
import {FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {FormattedMessage} from "react-intl";
import {useAssetTypesStore} from "../../../asset-types/store/asset-types.selector";
import {useIntlStore} from "../../../intl/store/intl.selector";
import {useMemo} from "react";
import {SystemAssetTypes} from "../../../asset-types/shared/enums/system-asset-types";
import {useCurrenciesStore} from "../../../currencies/store/currencies.selector";

interface IProps {
  index: number;
}

export const ForwardOperation = observer(({index}: IProps) => {
  const {control, watch} = useFormContext<IFormTransaction>();
  const assetTypeStore = useAssetTypesStore();
  const currencyStore = useCurrenciesStore();
  const intlStore = useIntlStore();

  const assetType = watch(`operations.${index}.assetType`);
  const isCurrency = useMemo(() => assetType === SystemAssetTypes.CURRENCY, [assetType]);

  return (<>
    {/*f.assetType*/}
    <Grid2 xs={6} sm={4} md={4}>
      {assetTypeStore.list.length && (
        <Controller
          name={`operations.${index}.assetType`}
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
      )}
    </Grid2>

    {/*/!*f.name*!/*/}
    <Grid2 xs={6} sm={4} md={4}>
      <Controller
        name={`operations.${index}.name`}
        control={control}
        rules={{
          required: "app.common.form.rules.required",
        }}
        render={({field, fieldState: {error}}) => (
          <Observer>{() => (
            (isCurrency && currencyStore.enabledList.length)
              ? (
                <FormControl fullWidth={true}>
                  <InputLabel id="forward-currency-label">
                    <FormattedMessage id={"app.transactions.form.labels.security"}/>
                  </InputLabel>

                  <Select
                    labelId="forward-currency-label"
                    label={<FormattedMessage id={"app.transactions.form.labels.security"}/>}
                    {...field}
                    error={!!error}
                  >
                    <MenuItem key="" value="">-</MenuItem>
                    {currencyStore.enabledList.map((item) => (
                      <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                    ))
                    }
                  </Select>

                  <FormHelperText error={true}>
                    <FormattedMessage id={error ? error.message : "app.empty"}/>
                  </FormHelperText>
                </FormControl>
              ) : (
                <TextField
                  fullWidth={true}
                  {...field}
                  error={!!error}
                  label={intlStore.formatMessage("app.transactions.form.labels.security")}
                  helperText={<FormattedMessage id={error ? error.message : "app.empty"}/>}
                />
              )

          )}</Observer>
        )}
      />
    </Grid2>

    {/*/!*f.amount*!/*/}
    <Grid2 xs={6} sm={4} md={4}>
      <Controller
        name={`operations.${index}.amount`}
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
  </>);
})
