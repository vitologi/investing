import {Container, ContainerModule, interfaces} from "inversify";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = object> = new (...args: any[]) => T;
export function buildIoc(modules: Array<Constructor>): Container {
  const di = new Container();
  const iocModule = new ContainerModule((bind: interfaces.Bind) => {
    for(let i=0; i< modules.length; i++){
      const Module = modules[i];
      bind(Module.name).to(Module).inSingletonScope();
    }
  });
  di.load(iocModule);

  return di;
}
