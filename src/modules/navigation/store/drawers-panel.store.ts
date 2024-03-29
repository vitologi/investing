import {injectable} from 'inversify';
import {action, makeObservable, observable} from 'mobx';

@injectable()
export class DrawersPanelStore {
  static key = Symbol.for('DrawersPanelStore');
  isOpen = false;

  constructor() {
    makeObservable(this, {
      isOpen: observable,
      toggleOpen: action.bound,
    });
  }

  toggleOpen(): void {
    this.isOpen = !this.isOpen;
  }
}
