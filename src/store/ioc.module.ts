import {ContainerModule, interfaces} from 'inversify';
import {IntlStore} from '../modules/intl/store/intl.store';
import {ThemeStore} from '../modules/theme/store/theme.store';
import {DrawersPanelStore} from '../modules/navigation/store/drawers-panel.store';
import {NavigationPanelStore} from '../modules/navigation/store/navigation-panel.store';
// import {OfflineService} from '../modules/offline/shared/services/offline.service';
// import {NotificationService} from '../modules/notification/shared/services/notification.service';
// import {UserService} from '../modules/auth/shared/services/user.service';
// import {OfflineStore} from '../modules/offline/store/offline.store';

export const IocModule = new ContainerModule((bind: interfaces.Bind) => {
  bind('IntlStore').to(IntlStore).inSingletonScope();
  bind('ThemeStore').to(ThemeStore).inSingletonScope();
  bind('DrawersPanelStore').to(DrawersPanelStore).inSingletonScope();
  bind('NavigationPanelStore').to(NavigationPanelStore).inSingletonScope();
  // bind('OfflineService').to(OfflineService).inSingletonScope();
  // bind('NotificationService').to(NotificationService).inSingletonScope();
  // bind('UserService').to(UserService).inSingletonScope();
  // bind('OfflineStore').to(OfflineStore).inSingletonScope();
});
