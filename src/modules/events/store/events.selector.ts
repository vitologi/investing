import {EventsStore} from './events.store';
import {useIocContainer} from '../../../store/ioc.selector';

export const useEventsStore = (): EventsStore => useIocContainer().get(EventsStore.key);

