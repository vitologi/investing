import DateFnsAdapter from '@date-io/date-fns';
import {enUS, Localization, ruRU} from '@mui/material/locale';
import {enUS as pickerEnUS, ru as pickerRuRu} from 'date-fns/locale';
import {injectable} from 'inversify';
import {computed, makeObservable, observable} from 'mobx';
import {createIntl, createIntlCache, IntlShape} from 'react-intl';
import {DateIOFormats, IUtils} from '@date-io/core/IUtils';

import {IntlKey} from '../index';
import enTranslation from '../locale/en.json';
import ruTranslation from '../locale/ru.json';
import {LanguageCode} from "../shared/enums/language-code";

@injectable()
export class IntlStore {
  static key = Symbol('IntlStore');
  locale: LanguageCode = LanguageCode.En;

  constructor() {
    makeObservable(this, {
      locale: observable,
      formatMessage: computed,
      formatDate: computed,
      intl: computed,
      dateAdapter: computed,
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

  get dateAdapter(): IUtils<Date> {
    return new DateFnsAdapter({locale: this.pickersLocale});
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

  setLanguage(value: LanguageCode): void {
    this.locale = value;
  }

  // TODO: deprecated (refactor in favor to universal method)
  switchToEnglish(): void {
    this.setLanguage(LanguageCode.En);
  }

  switchToRussian(): void {
    this.setLanguage(LanguageCode.Ru);
  }
}
