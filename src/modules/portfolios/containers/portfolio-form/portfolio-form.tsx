import {Button, Paper, Stack, TextField} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import {useCallback} from "react";
import ObjectId from "bson-objectid";
import {useNavigate} from "react-router-dom";
import {usePortfoliosStore} from "../../store/portfolios.selector";
import {useIntlStore} from "../../../intl/store/intl.selector";
import {FormattedMessage} from "react-intl";

interface IFormData {
  id: string;
  name: string;
  description: string;
}

export const PortfolioForm = () => {
  const navigate = useNavigate();
  const intlStore = useIntlStore();
  const store = usePortfoliosStore();
  const {handleSubmit, control} = useForm<IFormData>({
    defaultValues: {
      id: new ObjectId().toHexString(),
      name: '',
      description: ''
    }
  });

  const saveHandler = useCallback(async (data: IFormData) => {
    await store.create({_id: data.id, name: data.name, description: data.description});
    navigate('..');
  }, [store, navigate]);

  return (
    <Paper sx={{m: 2, p: 2}}>

      <Stack component="form" onSubmit={handleSubmit(saveHandler)}>

        <Controller
          name={"name"}
          control={control}
          rules={{
            required: "app.common.form.rules.required",
            minLength: {
              message: "app.common.form.rules.length",
              value: 3,
            },
            maxLength: {
              message: "app.common.form.rules.length",
              value: 12,
            },
          }}
          render={({field, fieldState: {error}}) => (
            <TextField
              {...field}
              error={!!error}
              label={intlStore.formatMessage("app.common.form.labels.name")}
              helperText={
                <FormattedMessage
                  id={error ? error.message : "app.empty"}
                  values={{minLength: 3, maxLength: 12}}
                />
              }
            />
          )}
        />

        <Controller
          name={"description"}
          control={control}
          rules={{
            required: "app.common.form.rules.required",
            minLength: {
              message: "app.common.form.rules.length",
              value: 3,
            },
          }}
          render={({field, fieldState: {error}}) => (
            <TextField
              {...field}
              error={!!error}
              label={intlStore.formatMessage("app.common.form.labels.description")}
              placeholder={intlStore.formatMessage("app.common.form.placeholder.description")}
              helperText={
                <FormattedMessage
                  id={error ? error.message : "app.empty"}
                  values={{minLength: 3, maxLength: 12}}
                />
              }
            />
          )}
        />

        <Button type="submit" sx={{p: 1}} color={"primary"} variant={"contained"}>
          <FormattedMessage id="app.common.actions.save"/>
        </Button>
      </Stack>
    </Paper>
  );
}
