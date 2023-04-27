import {PropsWithChildren, ReactElement} from 'react';

export const Titled = (props: PropsWithChildren<{ title: string }>): ReactElement => {
  return <>{props. children}</>;
};
