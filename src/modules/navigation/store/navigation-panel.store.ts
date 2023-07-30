import {injectable} from 'inversify';
import {action, makeObservable, observable} from 'mobx';

@injectable()
export class NavigationPanelStore {
  static key = Symbol.for('NavigationPanelStore');
  isOpen = false;
  title = 'app.titles.main';
  path = '/';

  constructor() {
    makeObservable(this, {
      isOpen: observable,
      title: observable,
      path: observable,
      setTitle: action.bound,
      setPath: action.bound,
      toggleOpen: action.bound,
    });
  }

  setTitle(title: string): void {
    this.title = title;
  }

  setPath(path: string): void {
    this.path = path;
  }

  toggleOpen(): void {
    this.isOpen = !this.isOpen;
  }
}
