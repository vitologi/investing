import {FormHelperText, IconButton, InputBase, Paper} from "@mui/material";
import {useForm} from "react-hook-form";
import {Save as SaveIcon} from "@mui/icons-material";
import {useCallback} from "react";
import ObjectId from "bson-objectid";
import {useNavigate} from "react-router-dom";
import {useAssetTypesStore} from "../../store/asset-types.selector";
import {useIntlStore} from "../../../intl/store/intl.selector";
import {FormattedMessage} from "react-intl";

interface IFormData {
  id: string;
  name: string;
  isSystem: false;
}

export const AssetTypeForm = () => {
  const {register, handleSubmit, formState: {errors}} = useForm<IFormData>({});
  const intlStore = useIntlStore();
  const store = useAssetTypesStore();
  const navigate = useNavigate();

  const saveHandler = useCallback(async (data: IFormData) => {
    await store.create({_id: data.id, name: data.name, isSystem: data.isSystem});
    navigate('..');
  }, [store, navigate]);

  return (
    <>
      <Paper
        component="form"
        onSubmit={handleSubmit(saveHandler)}
        sx={{m: 1, p: 1, display: 'flex', alignItems: 'center'}}
      >
        <input type="hidden" {...register("id", {value: new ObjectId().toHexString()})}/>
        <input type="hidden" {...register("isSystem", {value: false})}/>

        <InputBase
          sx={{flex: 1}}
          placeholder={intlStore.formatMessage("app.assetTypes.form.name")}
          inputProps={register("name", {
            required: "app.common.form.rules.required",
            minLength: {
              message: "app.common.form.rules.length",
              value: 3,
            },
            maxLength: {
              message: "app.common.form.rules.length",
              value: 12,  // TODO: move these values into global area
            },
          })}
          error={!!errors.name}
        />

        <IconButton
          type="submit"
          sx={{p: 1}}
          aria-label={intlStore.formatMessage("app.common.actions.save")}
        >
          <SaveIcon/>
        </IconButton>
      </Paper>

      {errors.name && (
        <FormHelperText sx={{p: 1, color: 'error.main'}}>
          <FormattedMessage id={errors.name?.message} values={{minLength: 3, maxLength: 12}}/>
        </FormHelperText>
      )}
    </>
  );
}
