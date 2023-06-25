import {ICurrencyDto} from "../currency.dto";

export const usdDto: ICurrencyDto = {
  _id: 'USD',  // code is id
  name: 'USD',
  symbol_native: '$',
  symbol: 'symbol',
  code: 'USD',
  name_plural: 'name_plural',
  rounding: 0,
  decimal_digits: 0,
};
export const eurDto: ICurrencyDto = {
  _id: 'EUR',  // code is id
  name: 'EUR',
  symbol_native: 'symbol_native',
  symbol: 'symbol',
  code: 'EUR',
  name_plural: 'name_plural',
  rounding: 0,
  decimal_digits: 0,
};

export const mockedList = [usdDto, eurDto];
