import {roundTo} from "./round-to";

describe('roundTo', () => {
  it('math rounding works', () => {
    expect(roundTo(10.543)).toBe(10.54);
    expect(roundTo(10.546)).toBe(10.55);
  });

  it('accept rounding precision', () => {
    expect(roundTo(10.543, 1)).toBe(10.5);
    expect(roundTo(10.1234567891534, 10)).toBe(10.1234567892);
  });

});
