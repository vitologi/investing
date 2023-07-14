import {injectable} from "inversify";

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
type TStorableData = { [key: string]: any };
const  STORAGE_KEY = "@investing.vitologi.com/setting"
@injectable()
export class StorageService {
  static key = Symbol.for('StorageService');
  storage: TStorableData = {};

  constructor() {
    const dataString = localStorage.getItem(STORAGE_KEY);
    if(dataString){
      this.storage = JSON.parse(dataString)
    }
  }

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  set(key: string, value: any){
    this.storage[key] = value;
    this.sync();
  }

  get<T>(key:string, defaultValue: T ): T {
    if(this.storage[key] === void 0){
      return defaultValue;
    }

    return this.storage[key];
  }

  private sync():void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.storage));
  }

}
