export interface IComposite<T> {
  getChildren(): T[];

  add(c: T): void;

  remove(c: T): void;
}
