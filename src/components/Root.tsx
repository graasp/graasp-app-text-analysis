import { FC } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import {
  GraaspContextDevTool,
  WithLocalContext,
  WithTokenContext,
  useObjectState,
} from '@graasp/apps-query-client';

import { CssBaseline, ThemeProvider, createTheme, styled } from '@mui/material';
import { grey, orange, pink } from '@mui/material/colors';
import { StyledEngineProvider } from '@mui/material/styles';

import { TEXT_ANALYSIS } from '@/langs/constants';

import { ENABLE_MOCK_API } from '../config/env';
import i18nConfig from '../config/i18n';
import {
  QueryClientProvider,
  ReactQueryDevtools,
  hooks,
  queryClient,
} from '../config/queryClient';
import { mockContext as defaultMockContext, mockMembers } from '../data/db';
import { showErrorToast } from '../utils/toast';
import App from './App';
import Loader from './common/Loader';

// declare the module to enable theme modification
declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: { background: string; color: string };
    };
  }

  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: { background: string; color: string };
    };
  }

  interface PaletteOptions {
    default: string;
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#5050d2',
    },
    secondary: pink,
    default: grey['500'],
    background: {
      paper: '#fff',
    },
  },
  status: {
    danger: {
      background: orange['400'],
      color: '#fff',
    },
  },
});

const RootDiv = styled('div')({
  flexGrow: 1,
  height: '100%',
});

// This function is necessary to allow to use translations.
const AppWithContext = (): JSX.Element => {
  const [mockContext, setMockContext] = useObjectState(defaultMockContext);
  const { t } = useTranslation();

  return (
    <WithLocalContext
      defaultValue={window.Cypress ? window.appContext : mockContext}
      LoadingComponent={<Loader />}
      useGetLocalContext={hooks.useGetLocalContext}
      useAutoResize={hooks.useAutoResize}
      onError={() => {
        showErrorToast(t(TEXT_ANALYSIS.CONTEXT_FETCHING_ERROR_MESSAGE));
      }}
    >
      <WithTokenContext
        LoadingComponent={<Loader />}
        useAuthToken={hooks.useAuthToken}
        onError={() => {
          showErrorToast(t(TEXT_ANALYSIS.TOKEN_REQUEST_ERROR_MESSAGE));
        }}
      >
        <ToastContainer position="bottom-right" />
        <App />
        {import.meta.env.DEV && ENABLE_MOCK_API && (
          <GraaspContextDevTool
            members={mockMembers}
            context={mockContext}
            setContext={setMockContext}
          />
        )}
      </WithTokenContext>
    </WithLocalContext>
  );
};

const Root: FC = () => (
  <RootDiv>
    {/* Used to define the order of injected properties between JSS and emotion */}
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        <I18nextProvider i18n={i18nConfig}>
          <QueryClientProvider client={queryClient}>
            <AppWithContext />
            {import.meta.env.DEV && <ReactQueryDevtools position="top-right" />}
          </QueryClientProvider>
        </I18nextProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  </RootDiv>
);

export default Root;
