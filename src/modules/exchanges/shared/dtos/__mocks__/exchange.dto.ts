import {IExchangeDto} from "../exchange.dto";

export const deExch: IExchangeDto = {
  "_id": "XETRA",
  "name": "Deutsche Boerse",
  "country": "Germany",
  "mic": "XETRA",
  "yahooSuffix": ".DE"
};

export const ruExch: IExchangeDto = {
  "_id": "MOEX",
  "name": "Moscow Exchange ",
  "country": "Russia",
  "mic": "MOEX",
  "yahooSuffix": ".ME"
};

export const enExch: IExchangeDto = {
  "_id": "XNYS",
  "name": "New York Stock Exchange",
  "country": "United States of America",
  "mic": "XNYS",
  "yahooSuffix": ""
};

export const list: IExchangeDto[] = [enExch, deExch, ruExch];
