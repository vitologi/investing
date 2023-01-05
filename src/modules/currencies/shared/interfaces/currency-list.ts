export interface ICurrencyList {
  currencyList: {
    [locale: string]: {
      [code: string]: {
        name: string;
        symbol_native: string;
        symbol: string;
        code: string;
        name_plural: string;
        rounding: number;
        decimal_digits: number;
      };
    };
  };
  getAll(locale_code?: string): {
    [locale: string]: {
      [code: string]: {
        name: string;
        symbol_native: string;
        symbol: string;
        code: string;
        name_plural: string;
        rounding: number;
        decimal_digits: number;
      };
    };
  } | {
    [code: string]: {
      name: string;
      symbol_native: string;
      symbol: string;
      code: string;
      name_plural: string;
      rounding: number;
      decimal_digits: number;
    };
  };
  get(currency_code: string, locale_code?: string): {
    name: string;
    symbol_native: string;
    symbol: string;
    code: string;
    name_plural: string;
    rounding: number;
    decimal_digits: number;
  };
}
