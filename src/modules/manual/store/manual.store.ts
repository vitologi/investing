import {inject, injectable} from 'inversify';
import {action, makeObservable, observable} from 'mobx';
import {StorageService} from "../../../shared/services/storage.service";

export const MANUAL_INIT = 'MANUAL_INIT';
export const DEMO_DIALOG_OPENED = 'DEMO_DIALOG_OPENED';

@injectable()
export class ManualStore {
  isInit = false;
  isDemoDialogOpened = true;
  constructor(@inject('StorageService') private storageService: StorageService) {
    makeObservable(this, {
      isInit: observable,
      isDemoDialogOpened: observable,
      setIsInit: action.bound,
      closeDemoDialog: action.bound,
    });
    this.isInit = this.storageService.get(MANUAL_INIT, false);
    this.isDemoDialogOpened = this.storageService.get(DEMO_DIALOG_OPENED, true);
  }

  setIsInit(value: boolean):void {
    this.isInit = value;
    this.storageService.set(MANUAL_INIT, value);
  }

  closeDemoDialog():void {
    this.isDemoDialogOpened = false;
    this.storageService.set(DEMO_DIALOG_OPENED, false);
  }
}
