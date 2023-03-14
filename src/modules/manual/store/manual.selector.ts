import {ManualStore} from './manual.store';
import {useIocContainer} from '../../../store/ioc.selector';

export const useManualStore = (): ManualStore => useIocContainer().get('ManualStore');
