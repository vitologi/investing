import {injectable} from 'inversify';
import {LanguageCode} from "../../shared/enums/language-code";

@injectable()
export class IntlStore {
  locale: LanguageCode = LanguageCode.En;
  _formatMessage = jest.fn();
  _formatDate = jest.fn();

  get formatMessage() {
    return this._formatMessage;
  }

  get formatDate() {
    return this._formatDate;
  }

  setLanguage = jest.fn();
  switchToEnglish = jest.fn();

  switchToRussian = jest.fn();
}
