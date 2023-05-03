import {parseToTimestamp} from "../parse-to-timestamp";

describe('parseToTimestamp', () => {
  test('should return the current timestamp when no input is provided', () => {
    const expectedTimestamp = new Date().setHours(0, 0, 0, 0);
    const actualTimestamp = parseToTimestamp();
    expect(actualTimestamp).toEqual(expectedTimestamp);
  });

  test('should return the correct timestamp when a number is provided', () => {
    const inputTimestamp = new Date(2022, 4, 3).getTime();
    const expectedTimestamp = new Date(2022, 4, 3).setHours(0, 0, 0, 0);
    const actualTimestamp = parseToTimestamp(inputTimestamp);
    expect(actualTimestamp).toEqual(expectedTimestamp);
  });

  test('should return the correct timestamp when a string is provided', () => {
    const inputString = '2022-05-03';
    const expectedTimestamp = new Date(2022, 4, 3).setHours(0, 0, 0, 0);
    const actualTimestamp = parseToTimestamp(inputString);
    expect(actualTimestamp).toEqual(expectedTimestamp);
  });

  test('should return the correct timestamp when a Date object is provided', () => {
    const inputDate = new Date(2022, 4, 3);
    const expectedTimestamp = new Date(2022, 4, 3).setHours(0, 0, 0, 0);
    const actualTimestamp = parseToTimestamp(inputDate);
    expect(actualTimestamp).toEqual(expectedTimestamp);
  });

})
