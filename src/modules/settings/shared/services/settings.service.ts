import {injectable} from "inversify";

@injectable()
export class SettingsService {
  static key = Symbol.for('SettingsService');
  init(): void {
  }
}
