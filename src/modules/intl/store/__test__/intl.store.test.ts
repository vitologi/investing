import {IntlStore} from "../intl.store";
import enLocale from "../../locale/en.json";
import DateFnsAdapter from "@date-io/date-fns";
import {LanguageCode} from "../../shared/enums/language-code";

describe('IntlStore', () => {
  let store: IntlStore;

  beforeEach(() => {
    store = new IntlStore();
  })


  test('should return intl shape', () => {
    expect(store.intl.formatters).toBeInstanceOf(Object);
  })

  test('should provide date adapter', () => {
    expect(store.dateAdapter).toBeInstanceOf(DateFnsAdapter);
  })

  test(`formatMessage (should return empty if key doesn't exist)`, () => {
    expect(store.formatMessage('UNDEFINED_KEY' as 'app.empty')).toBe(enLocale["app.empty"]);
  })

  test(`formatDate (should properly format date)`, () => {
    expect(store.formatDate(new Date('05-19-2023'))).toBe('May 19, 2023');
    expect(store.formatDate(new Date('05-19-2023'), "normalDateWithWeekday")).toBe('Fri, May 19');
  })

  test(`setLanguage (should change app locale)`, () => {
    expect(store.appLocale["app.common.statuses.error"]).toBe("Error");
    store.setLanguage(LanguageCode.Ru);
    expect(store.appLocale["app.common.statuses.error"]).toBe("Ошибка");
  })

  test(`setLanguage (should change theme locale)`, () => {
    expect(store.themeLocale).toEqual({});
    store.setLanguage(LanguageCode.Ru);
    expect(store.themeLocale.components?.MuiAlert?.defaultProps.closeText).toBe("Закрыть");
  })

  test(`switchTo... (should change language)`, () => {
    const spy = jest.spyOn(store, "setLanguage");
    store.switchToEnglish();
    store.switchToRussian();

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(LanguageCode.En);
    expect(spy).toHaveBeenCalledWith(LanguageCode.Ru);
  })

});
