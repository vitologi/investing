import {PortfoliosStore} from './portfolios.store';
import {useIocContainer} from '../../../store/ioc.selector';

export const usePortfoliosStore = (): PortfoliosStore => useIocContainer().get('PortfoliosStore');
