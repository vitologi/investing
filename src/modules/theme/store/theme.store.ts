import {createTheme, Theme, ThemeOptions} from '@mui/material/styles';
import {deepmerge} from '@mui/utils';
import {injectable} from 'inversify';
import { action, computed, observable, makeObservable } from 'mobx';

@injectable()
export class ThemeStore {
  static key = Symbol.for('ThemeStore');
  THEME_SPACING = 8;

  theme: ThemeOptions = {
    palette: {
      mode: 'light',
      primary: {
        main: '#142E2E',
        dark: '#0C2626',
        light: '#386262',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#211B35',
        dark: '#17102B',
        light: '#494067',
        contrastText: '#ffffff',
      },
      info: {
        main: '#3A471F',
        dark: '#2E3B13',
        light: '#647542',
        contrastText: '#ffffff',
      },
      success: {
        main: '#32A561',
        dark: '#2c9155',
        light: '#47ae71',
        contrastText: '#ffffff',
      },
      warning: {
        main: '#BFA430',
        dark: '#a8902a',
        light: '#c5ad45',
        contrastText: '#000000',
      },
      error: {
        main: '#B45252',
        dark: '#9e4848',
        light: '#bc6363',
        contrastText: '#ffffff',
      },
      background: {
        default: '#eeeeee',
        paper: '#ffffff',
      }
    }
  };

  constructor() {
    makeObservable(this, {
      theme: observable,
      overrides: computed,
      extendedTheme: computed,
      patchTheme: action.bound
    });
  }

  get overrides(): ThemeOptions {
    return {
      spacing: (factor?: number): number => this.THEME_SPACING * (factor === undefined ? 1 : factor),
      components: {
        MuiIconButton: {
          styleOverrides: {
            colorPrimary: {},
          },
        },
      },
    };
  }

  get extendedTheme(): Theme {
    return createTheme({
      ...this.theme,
      ...this.overrides,
    });
  }

  patchTheme(theme: ThemeOptions): void {
    this.theme = deepmerge(this.theme, theme);
  }
}
