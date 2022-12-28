import {NavigationPanelStore} from './navigation-panel.store';
import {useIocContainer} from '../../../store/ioc.selector';

export const useNavigationPanelStore = (): NavigationPanelStore => useIocContainer().get('NavigationPanelStore');
