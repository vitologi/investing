import {inject, injectable} from 'inversify';
import {makeObservable} from 'mobx';
import {SettingsService} from "../shared/services/settings.service";

@injectable()
export class SettingsStore{
  constructor(@inject('SettingsService') settingsService: SettingsService) {
    makeObservable(this, {});
    settingsService.init();
  }
}
