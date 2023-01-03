import {AssetTypesStore} from './asset-types.store';
import {useIocContainer} from '../../../store/ioc.selector';

export const useAssetTypesStore = (): AssetTypesStore => useIocContainer().get('AssetTypesStore');
