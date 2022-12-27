import {ThemeStore} from './theme.store';
import {useIocContainer} from '../../../store/ioc.selector';

export const useThemeStore = (): ThemeStore => useIocContainer().get('ThemeStore');
