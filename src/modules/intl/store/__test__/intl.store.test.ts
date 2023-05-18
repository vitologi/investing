import {IntlStore} from "../intl.store";

describe('IntlStore', ()=>{
  let store: IntlStore;

  beforeEach(()=>{
    store = new IntlStore();
  })


  test('should return intl shape', ()=>{
    expect(store.intl.formatters).toBeInstanceOf(Object);
  })

});
