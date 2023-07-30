import {isPositive} from "../is-positive";

describe('isPositive', () => {

  test('return true if number is positive or zero', () => {
    expect(isPositive(0)).toBe(true);
    expect(isPositive(1245)).toBe(true);
  });

  test('return false if number is negative', () => {
    expect(isPositive(-1)).toBe(false);
  });

});
