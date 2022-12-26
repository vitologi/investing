import {createContext, PropsWithChildren} from 'react';
import {interfaces} from 'inversify';
import {iocContainer} from '../../../store/ioc.container';

export const DiContext = createContext<interfaces.Container>(iocContainer);

export function DiProvider({ container, children }: PropsWithChildren<{ container?: interfaces.Container }>): JSX.Element {
  return <DiContext.Provider value={container || iocContainer}>{children}</DiContext.Provider>;
}
