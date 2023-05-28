import {CurrenciesStore as Base} from '../currencies.store';
import {CurrenciesService} from "../../shared/services/currencies.service";
import {CurrencyRatesService} from "../../shared/services/currency-rates.service";
import {IntlStore} from "../../../intl/store/intl.store";
import {StorageService} from "../../../../shared/services/storage.service";

jest.mock("../../shared/services/currencies.service");
jest.mock("../../shared/services/currency-rates.service");
jest.mock("../../../intl/store/intl.store");
jest.mock("../../../../shared/services/storage.service");

export class CurrenciesStore extends Base {
  constructor() {
    super(
      new CurrenciesService(),
      new CurrencyRatesService(),
      new IntlStore(),
      new StorageService(),
    );
  }
}
