import {useIocContainer} from '../../../store/ioc.selector';
import {TransactionsTransferStore} from "./transactions-transfer.store";

export const useTransactionsTransferStore = (): TransactionsTransferStore => useIocContainer().get(TransactionsTransferStore.key);
