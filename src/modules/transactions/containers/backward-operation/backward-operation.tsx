import {Observer, observer} from "mobx-react-lite";
import {Controller, useFormContext} from "react-hook-form";
import {IFormTransaction} from "../../shared/interfaces/form-transaction";
import Grid2 from "@mui/material/Unstable_Grid2";
import {FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {FormattedMessage} from "react-intl";
import {useIntlStore} from "../../../intl/store/intl.selector";
import {useCurrenciesStore} from "../../../currencies/store/currencies.selector";

interface IProps {
  index: number;
}

export const BackwardOperation = observer(({index}: IProps) => {
  const {control} = useFormContext<IFormTransaction>();
  const currencyStore = useCurrenciesStore();
  const intlStore = useIntlStore();

  return (<>
    {/*/!*b.name*!/*/}
    <Grid2 xs={6} sm={4} md={4}>
      <Controller
        name={`operations.${index}.name`}
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

    {/*/!*b.amount*!/*/}
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
            label={intlStore.formatMessage("app.transactions.form.labels.price")}
            helperText={<FormattedMessage id={error ? error.message : "app.empty"}/>}
          />
        )}
      />
    </Grid2>
  </>);
})
