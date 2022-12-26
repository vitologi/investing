import {interfaces} from 'inversify';
import {useContext} from 'react';
import {DiContext} from '../shared/components/di/di.provider';

export const useIocContainer = (): interfaces.Container => useContext(DiContext);
