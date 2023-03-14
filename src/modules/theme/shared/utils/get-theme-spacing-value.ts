import { Theme } from "@mui/material/styles";

export const getThemeSpacingValue = (theme: Theme, value: number): number => Number(theme.spacing(value).slice(0, -2));
