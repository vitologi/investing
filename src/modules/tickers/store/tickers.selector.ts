import {TickersStore} from './tickers.store';
import {useIocContainer} from '../../../store/ioc.selector';

export const useTickersStore = (): TickersStore => useIocContainer().get('TickersStore');
