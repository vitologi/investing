import {inject, injectable} from 'inversify';
import {makeObservable} from 'mobx';
import {SettingsService} from "../shared/services/settings.service";

@injectable()
export class SettingsStore {
  static key = Symbol.for('SettingsStore');

  constructor(@inject(SettingsService.key) settingsService: SettingsService) {
    makeObservable(this, {});
    settingsService.init();
  }
}
