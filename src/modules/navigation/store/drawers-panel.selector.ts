import {DrawersPanelStore} from './drawers-panel.store';
import {useIocContainer} from '../../../store/ioc.selector';

export const useDrawersPanelStore = (): DrawersPanelStore => useIocContainer().get(DrawersPanelStore.key);
