import {ExchangeStore} from './exchange.store';
import {useIocContainer} from '../../../store/ioc.selector';

export const useExchangeStore = (): ExchangeStore => useIocContainer().get(ExchangeStore.key);
