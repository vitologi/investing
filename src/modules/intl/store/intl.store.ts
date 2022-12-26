import DateFnsUtils from '@date-io/date-fns';
import DateFnsAdapter from '@date-io/date-fns';
import {createTheme, Theme} from '@mui/material';
import {enUS, Localization, ruRU} from '@mui/material/locale';
import {enUS as pickerEnUS, ru as pickerRuRu} from 'date-fns/locale';
import {injectable} from 'inversify';
import { computed, observable, makeObservable } from 'mobx';
import {createIntl, createIntlCache, IntlShape} from 'react-intl';
import {DateIOFormats} from '@date-io/core/IUtils';

import {IntlKey} from '../index';
import enTranslation from '../locale/en.json';
import ruTranslation from '../locale/ru.json';

@injectable()
export class IntlStore {
  locale: 'en' | 'ru' = 'en';

  constructor() {
    makeObservable(this, {
      locale: observable,
      formatMessage: computed,
      formatDate: computed,
      intl: computed,
      dateAdapter: computed,
      theme: computed,
      pickersTheme: computed,
      appLocale: computed,
      themeLocale: computed,
      pickersLocale: computed
    });
  }

  get formatMessage() {
    return (id: IntlKey): string => this.appLocale[id] || this.appLocale['app.empty'];
  }

  get formatDate() {
    return (date: Date, format: keyof DateIOFormats = 'fullDate'): string => this.dateAdapter.format(date, format);
  }

  get intl(): IntlShape {
    return createIntl({locale: this.locale, messages: this.appLocale}, this.cache);
  }

  get dateAdapter(): DateFnsUtils {
    return new DateFnsAdapter({locale: this.pickersLocale});
  }

  get theme(): Theme {
    return createTheme({}, this.themeLocale);
  }

  get pickersTheme(): Theme {
    return createTheme({}, this.pickersLocale);
  }

  get appLocale(): Record<string, string> {
    return this.appLocaleMap[this.locale];
  }

  get themeLocale(): Localization {
    return this.themeLocaleMap[this.locale];
  }

  get pickersLocale(): Locale {
    return this.pickersLocaleMap[this.locale];
  }

  private cache = createIntlCache();

  private appLocaleMap: Record<string, Record<string, string>> = {
    ru: ruTranslation,
    en: enTranslation,
  };

  private themeLocaleMap: { [key: string]: Localization } = {
    ru: ruRU,
    en: enUS,
  };

  private pickersLocaleMap: { [key: string]: Locale } = {
    ru: pickerRuRu,
    en: pickerEnUS,
  };

  switchToEnglish(): void {
    this.locale = 'en';
  }

  switchToRussian(): void {
    this.locale = 'ru';
  }
}