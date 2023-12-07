import { FC } from 'react';
import { I18nextProvider } from 'react-i18next';
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

import { MOCK_API } from '../config/env';
import i18nConfig from '../config/i18n';
import {
  CONTEXT_FETCHING_ERROR_MESSAGE,
  TOKEN_REQUEST_ERROR_MESSAGE,
} from '../config/messages';
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

const Root: FC = () => {
  const [mockContext, setMockContext] = useObjectState(defaultMockContext);

  return (
    <RootDiv>
      {/* Used to define the order of injected properties between JSS and emotion */}
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline enableColorScheme />
          <I18nextProvider i18n={i18nConfig}>
            <QueryClientProvider client={queryClient}>
              <WithLocalContext
                defaultValue={window.Cypress ? window.appContext : mockContext}
                LoadingComponent={<Loader />}
                useGetLocalContext={hooks.useGetLocalContext}
                useAutoResize={hooks.useAutoResize}
                onError={() => {
                  showErrorToast(CONTEXT_FETCHING_ERROR_MESSAGE);
                }}
              >
                <WithTokenContext
                  LoadingComponent={<Loader />}
                  useAuthToken={hooks.useAuthToken}
                  onError={() => {
                    showErrorToast(TOKEN_REQUEST_ERROR_MESSAGE);
                  }}
                >
                  <ToastContainer position="bottom-right" />
                  <App />
                  {process.env.NODE_ENV === 'development' && MOCK_API && (
                    <GraaspContextDevTool
                      members={mockMembers}
                      context={mockContext}
                      setContext={setMockContext}
                    />
                  )}
                </WithTokenContext>
              </WithLocalContext>
              {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools position="top-right" />
              )}
            </QueryClientProvider>
          </I18nextProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </RootDiv>
  );
};

export default Root;
