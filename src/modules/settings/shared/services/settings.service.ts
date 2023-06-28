import {injectable} from "inversify";

@injectable()
export class SettingsService {
  static key = Symbol('SettingsService');
  init(): void {
  }
}
