import {observer} from "mobx-react-lite";
import {lazy, useCallback} from "react";
import {useManualStore} from "../../store/manual.selector";
import {useIntlStore} from "../../../intl/store/intl.selector";
import {LanguageCode} from "../../../intl/shared/enums/language-code";
import {useNavigate} from "react-router-dom";

const FirstStepRu = lazy(() => import('../../components/first-steps-content/first-steps-content.ru'));
const FirstStepEn = lazy(() => import('../../components/first-steps-content/first-steps-content.en'));

export const FirstSteps = observer(() => {
  const navigate = useNavigate();
  const store = useManualStore();
  const intlStore = useIntlStore();

  const onFinishHandler = useCallback(() => {
    store.setIsInit(true);
    navigate('/');
  }, [store, navigate]);

  switch (intlStore.locale) {
    case LanguageCode.Ru:
      return (<FirstStepRu onFinish={onFinishHandler}/>);

    case LanguageCode.En:
    default:
      return (<FirstStepEn onFinish={onFinishHandler}/>);
  }
});
