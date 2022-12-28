import {inject, injectable} from 'inversify';
import {action, makeObservable, observable} from 'mobx';

import {DrawersPanelStore} from './drawers-panel.store';

@injectable()
export class NavigationPanelStore {
  isOpen = false;
  title = 'app.titles.main';
  path = '/';

  @inject('DrawersPanelStore')
  private drawersPanelStore!: DrawersPanelStore;

  constructor() {
    makeObservable(this, {
      isOpen: observable,
      title: observable,
      path: observable,
      setTitle: action.bound,
      setPath: action.bound,
      toggleOpen: action.bound,
      toggleDrawer: action.bound,
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

  toggleDrawer(): void {
    this.drawersPanelStore.toggleOpen();
  }
}
