import { configureQueryClient } from '@graasp/apps-query-client';

import { MOCK_API, REACT_APP_API_HOST, REACT_APP_GRAASP_APP_KEY } from './env';

const {
  queryClient,
  QueryClientProvider,
  ReactQueryDevtools,
  hooks,
  useMutation,
  API_ROUTES,
  mutations,
} = configureQueryClient({
  notifier: (data) => {
    // eslint-disable-next-line no-console
    console.log('notifier: ', data);
  },
  keepPreviousData: true,
  // avoid refetching when same data are closely fetched
  staleTime: 1000, // ms
  API_HOST: REACT_APP_API_HOST,
  GRAASP_APP_KEY: REACT_APP_GRAASP_APP_KEY,
  isStandalone: MOCK_API,
});

export {
  queryClient,
  mutations,
  QueryClientProvider,
  ReactQueryDevtools,
  hooks,
  useMutation,
  API_ROUTES,
};
