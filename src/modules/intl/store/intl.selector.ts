import {IntlStore} from './intl.store';
import {useIocContainer} from '../../../store/ioc.selector';

export const useIntlStore = (): IntlStore => useIocContainer().get(IntlStore.key);
