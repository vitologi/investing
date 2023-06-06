import {createContext, PropsWithChildren} from 'react';
import {interfaces} from 'inversify';

export const DiContext = createContext<interfaces.Container | null>(null);

export function DiProvider({ container, children }: PropsWithChildren<{ container: interfaces.Container }>): JSX.Element {
  return <DiContext.Provider value={container}>{children}</DiContext.Provider>;
}
