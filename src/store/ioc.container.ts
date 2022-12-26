import {Container} from 'inversify';
import {IocModule} from './ioc.module';

const iocContainer = new Container();
iocContainer.load(IocModule);

export {iocContainer};
