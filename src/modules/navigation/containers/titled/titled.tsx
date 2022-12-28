import {useResolvedPath} from 'react-router-dom';
import {PropsWithChildren, ReactElement, useEffect} from 'react';
import {useNavigationPanelStore} from '../../store/navigation-panel.selector';

export const Titled = (props: PropsWithChildren<{ title: string }>): ReactElement => {
  const store = useNavigationPanelStore();
  const {title, children} = props;
  const data = useResolvedPath('.');

  useEffect(()=>{
    store.setPath(data.pathname);
    store.setTitle(title);
  }, [data.pathname, title, store]);

  return <>{children}</>;
};
