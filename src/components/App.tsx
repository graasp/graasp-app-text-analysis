import { RecordOf } from 'immutable';

import React, { FC, ReactElement, useContext, useEffect } from 'react';

import { Context as HOCContext, LocalContext } from '@graasp/apps-query-client';
import { Context } from '@graasp/sdk';

import { DEFAULT_CONTEXT_LANGUAGE } from '../config/appSettings';
import i18n from '../config/i18n';
import { AppDataProvider } from './context/AppDataContext';
import { AppSettingProvider } from './context/AppSettingContext';
import { MembersProvider } from './context/MembersContext';
import BuilderView from './views/admin/BuilderView';
import PlayerView from './views/read/PlayerView';

const App: FC = () => {
  const context: RecordOf<LocalContext> = useContext(HOCContext);

  useEffect(() => {
    // handle a change of language
    const lang = context?.get('lang') ?? DEFAULT_CONTEXT_LANGUAGE;
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [context]);

  const renderContent = (): ReactElement => {
    switch (context.get('context')) {
      case Context.BUILDER:
        return <BuilderView />;

      // eslint-disable-next-line no-fallthrough
      case Context.ANALYTICS:
      // todo: add the view to show in the analyzer

      // eslint-disable-next-line no-fallthrough
      case Context.PLAYER:
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
