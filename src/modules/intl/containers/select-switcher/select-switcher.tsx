import {observer} from "mobx-react-lite";
import {useIntlStore} from "../../store/intl.selector";
import {MenuItem, Select} from "@mui/material";
import {LanguageCode} from "../../shared/enums/language-code";
import {useCallback} from "react";
import {SelectChangeEvent} from "@mui/material/Select/SelectInput";
import {SelectProps} from "@mui/material/Select/Select";

export const SelectSwitcher = observer((props:SelectProps<LanguageCode> ) => {
  const store = useIntlStore();

  const onChange = useCallback((event: SelectChangeEvent<LanguageCode>) => {
    const value = event.target.value as LanguageCode;
    store.setLanguage(value);
  }, [store]);

  return (
    <Select {...props} onChange={onChange} value={store.locale}>
      {Object.values(LanguageCode).map((item) => (
        <MenuItem key={item} value={item}>{item}</MenuItem>
      ))}
    </Select>
  )
})
