import {SettingsStore} from './settings.store';
import {useIocContainer} from '../../../store/ioc.selector';

export const useSettingsStore = (): SettingsStore => useIocContainer().get(SettingsStore.key);
