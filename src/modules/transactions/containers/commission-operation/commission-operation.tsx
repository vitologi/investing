import {observer} from "mobx-react-lite";
import {Controller, useFormContext} from "react-hook-form";
import {IFormTransaction} from "../../shared/interfaces/form-transaction";
import Grid2 from "@mui/material/Unstable_Grid2";
import {TextField} from "@mui/material";
import {FormattedMessage} from "react-intl";
import {useIntlStore} from "../../../intl/store/intl.selector";

interface IProps {
  index: number;
}

export const CommissionOperation = observer(({index}: IProps) => {
  const {control} = useFormContext<IFormTransaction>();
  const intlStore = useIntlStore();

  return (<>
    {/*/!*c.amount*!/*/}
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
            label={intlStore.formatMessage("app.transactions.form.labels.commission")}
            helperText={<FormattedMessage id={error ? error.message : "app.empty"}/>}
          />
        )}
      />
    </Grid2>
  </>);
})
