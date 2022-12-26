import messages from './locale/en.json';
export {LanguageSwitcher} from './containers/switcher/switcher';
export {IntlProviderWrapper} from './containers/intl-provider-wrapper/intl-provider-wrapper';

export type IntlKey = keyof typeof messages;
