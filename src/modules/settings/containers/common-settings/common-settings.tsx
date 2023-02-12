import {observer} from "mobx-react-lite";
import {
  Card,
  CardHeader,
  CardContent,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {FormattedMessage} from "react-intl";
import {useCallback, useMemo} from "react";
import {useCurrenciesStore} from "../../../currencies/store/currencies.selector";
import {SelectChangeEvent} from "@mui/material/Select/SelectInput";

export const CommonSettings = observer(() => {
  const currencyStore = useCurrenciesStore();
  const currencyValue = useMemo(
    () => (currencyStore.baseCurrency ? currencyStore.baseCurrency.code : ''),
    [currencyStore.baseCurrency]
  );

  const selectBaseCurrencyHandler = useCallback((e: SelectChangeEvent<string>) => {
    currencyStore.setBaseCurrency(e.target.value);
  }, [currencyStore]);

  return (
    <Card sx={{m: 1}}>
      <CardHeader title={<FormattedMessage id={"app.settings.titles.common"}/>}/>

      <CardContent>
        <Stack direction={"column"} spacing={2}>
          <FormControl fullWidth={true}>
            <InputLabel id="currency-label">
              <FormattedMessage id={"app.settings.baseCurrency"}/>
            </InputLabel>

            <Select
              labelId="currency-label"
              label={<FormattedMessage id={"app.settings.baseCurrency"}/>}
              value={currencyValue}
              onChange={selectBaseCurrencyHandler}
            >
              {currencyStore.enabledList.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  ({item.code}) {item.name}
                </MenuItem>
              ))
              }
            </Select>
          </FormControl>
        </Stack>
      </CardContent>
    </Card>
  );
})
