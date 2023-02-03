import {action, computed, makeObservable, observable} from "mobx";
import {ITicker} from "../interfaces/ticker";
import {AssetType} from "../../../asset-types/shared/models/asset-type";
import {IOperation} from "../../../transactions/shared/interfaces/operation";
import {Operation} from "../../../transactions/shared/models/operation";
import {Portfolio} from "../../../portfolios/shared/models/portfolio";
import {IComposite} from "../../../../shared/interfaces/composite";

export class CompositeTicker implements ITicker, IComposite<ITicker> {
  children: ITicker[] = [];

  constructor() {
    makeObservable(this, {
      children: observable,
      amount: computed,
      child: computed,
      isCurrency: computed,
      lastSync: computed,
      operations: computed,
      portfolio: computed,
      assetType: computed,
      security: computed,
      avgPrice: computed,
      amountOnDate: action,
      oppositeOnDate: action,
      isDuplicate: action,
      add: action,
      getChildren: action,
      remove: action,
    });
  }

  get id(): string {
    return this.children.reduce((id, item) => id + item.id, '');
  }

  get amount(): number {
    return this.children.reduce((acc, item) => acc + item.amount, 0);
  }

  get child(): ITicker {
    const item = this.children[0];
    if (!item) {
      throw new Error(`Composite ticker hasn't any children`);
    }
    return item;
  }

  get assetType(): AssetType {
    return this.child.assetType;
  }

  get lastSync(): Date {
    return this.child.lastSync;
  }

  get portfolio(): Portfolio {
    return this.child.portfolio;
  }

  get security(): string {
    return this.child.security;
  }

  get isCurrency(): boolean {
    return this.child.isCurrency;
  }

  get operations(): Operation[] {
    //TODO: join the same operations
    return this.children.reduce((acc, item) => acc.concat(item.operations), [] as IOperation[]);
  }

  get avgPrice(): () => number {
    return (currencyCode?: string): number => {
      const allPrices = this.children.reduce((acc, item) => acc + item.avgPrice(currencyCode), 0);
      return allPrices / this.children.length;
    };
  }

  amountOnDate(date?: Date): number {
    return this.children.reduce((acc, item) => acc + item.amountOnDate(date), 0);
  }


  isDuplicate(value: ITicker): boolean {
    return this.child.isDuplicate(value);
  }

  oppositeOnDate(date?: Date): IOperation[] {
    //TODO: join the same operations
    return this.children.reduce((acc, item) => acc.concat(item.oppositeOnDate(date)), [] as IOperation[]);
  }


  add(value: ITicker): void {
    if (this.children.includes(value)) {
      return;
    }
    this.children.push(value);
  }

  getChildren(): ITicker[] {
    return this.children;
  }

  remove(value: ITicker): void {
    if (this.children.includes(value)) {
      this.children.splice(this.children.indexOf(value), 1);
    }
  }
}
