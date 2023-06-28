import {TransactionsStore} from './transactions.store';
import {useIocContainer} from '../../../store/ioc.selector';

export const useTransactionsStore = (): TransactionsStore => useIocContainer().get(TransactionsStore.key);
