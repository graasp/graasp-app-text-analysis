import { FC, ReactElement, useEffect } from 'react';

import { useLocalContext } from '@graasp/apps-query-client';
import { Context } from '@graasp/sdk';

import { DEFAULT_CONTEXT_LANGUAGE } from '../config/appSettings';
import i18n from '../config/i18n';
import { AppDataProvider } from './context/AppDataContext';
import { AppSettingProvider } from './context/AppSettingContext';
import { MembersProvider } from './context/MembersContext';
import BuilderView from './views/admin/BuilderView';
import PlayerView from './views/read/PlayerView';

const App: FC = () => {
  const context = useLocalContext();

  useEffect(() => {
    // handle a change of language
    const lang = context?.get('lang') ?? DEFAULT_CONTEXT_LANGUAGE;

    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [context]);

  const renderContent = (): ReactElement => {
    switch (context.get('context')) {
      case Context.Builder:
        return <BuilderView />;

      // eslint-disable-next-line no-fallthrough
      case Context.Analytics:
      // todo: add the view to show in the analyzer

      // eslint-disable-next-line no-fallthrough
      case Context.Player:
        return <PlayerView />;

      // eslint-disable-next-line no-fallthrough
      default:
        return <PlayerView />;
    }
  };

  return (
    <MembersProvider>
      <AppDataProvider>
        <AppSettingProvider>{renderContent()}</AppSettingProvider>
      </AppDataProvider>
    </MembersProvider>
  );
};

export default App;
