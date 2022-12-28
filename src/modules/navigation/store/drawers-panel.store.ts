import {injectable} from 'inversify';
import {action, makeObservable, observable} from 'mobx';

@injectable()
export class DrawersPanelStore {
  isOpen = false;
  isGroupOpen: Map<string, boolean> = new Map([]);

  constructor() {
    makeObservable(this, {
      isOpen: observable,
      isGroupOpen: observable,
      toggleOpen: action.bound,
      toggleGroup: action.bound,
      initializeGroup: action.bound,
    });
  }

  toggleOpen(): void {
    this.isOpen = !this.isOpen;
  }

  toggleGroup(groupName: string): void {
    const isOpen = this.isGroupOpen.get(groupName);

    this.isGroupOpen.set(groupName, !isOpen);
  }

  initializeGroup(groupName: string): string {
    if (!this.isGroupOpen.has(groupName)) {
      this.isGroupOpen.set(groupName, false);
    }
    return groupName;
  }
}
