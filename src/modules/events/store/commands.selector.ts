import {useIocContainer} from '../../../store/ioc.selector';
import {CommandsStore} from "./commands.store";

export const useCommandsStore = (): CommandsStore => useIocContainer().get(CommandsStore.key);

