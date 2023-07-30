import {injectable} from 'inversify';
import {LanguageCode} from "../../shared/enums/language-code";
import {action, makeObservable, observable} from "mobx";

@injectable()
export class IntlStore {
  static key = Symbol.for('IntlStore');
  locale: LanguageCode = LanguageCode.En;
  _formatMessage = jest.fn();
  _formatDate = jest.fn();

  get formatMessage() {
    return this._formatMessage;
  }

  get formatDate() {
    return this._formatDate;
  }

  constructor() {
    makeObservable(this, {
      locale: observable,
      setLanguage: action,
    })
  }

  setLanguage(ln: LanguageCode){
    this.locale = ln;
  }
  switchToEnglish = jest.fn();

  switchToRussian = jest.fn();
}
