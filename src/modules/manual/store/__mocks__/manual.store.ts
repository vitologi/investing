import {injectable} from 'inversify';
import {action, makeObservable, observable} from 'mobx';

export const MANUAL_INIT = 'MANUAL_INIT';
export const DEMO_DIALOG_OPENED = 'DEMO_DIALOG_OPENED';

@injectable()
export class ManualStore {
  isInit = false;
  isDemoDialogOpened = false;
  constructor() {
    makeObservable(this, {
      isInit: observable,
      isDemoDialogOpened: observable,
      setIsInit: action.bound,
      closeDemoDialog: action.bound,
    });
  }

  setIsInit(value: boolean):void {
    this.isInit = value;
  }

  closeDemoDialog():void {
    this.isDemoDialogOpened = false;
  }
}
