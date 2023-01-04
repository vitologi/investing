import {CurrenciesStore} from './currencies.store';
import {useIocContainer} from '../../../store/ioc.selector';

export const useCurrenciesStore = (): CurrenciesStore => useIocContainer().get('CurrenciesStore');
