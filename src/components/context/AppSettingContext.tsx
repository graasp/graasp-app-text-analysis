import React, { FC, PropsWithChildren, createContext, useMemo } from 'react';

import { Data } from '@graasp/apps-query-client';
import { AppSetting } from '@graasp/sdk';

import { hooks, mutations } from '../../config/queryClient';
import Loader from '../common/Loader';

type PostAppSettingType = {
  data: { [key: string]: unknown };
  name: string;
};

type PatchAppSettingType = {
  data: { [key: string]: unknown };
  id: string;
};

export type AppSettingContextType = {
  postAppSetting: (payload: PostAppSettingType) => Promise<AppSetting<Data>>;
  patchAppSetting: (payload: PatchAppSettingType) => Promise<AppSetting<Data>>;
  appSettingArray: AppSetting[];
  isPatchError: boolean;
  isPostError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
};

const defaultContextValue = {
  postAppSetting: () => Promise.reject(),
  patchAppSetting: () => Promise.reject(),
  appSettingArray: [],
  isPatchError: false,
  isPostError: false,
  isLoading: false,
  isSuccess: false,
};

const AppSettingContext =
  createContext<AppSettingContextType>(defaultContextValue);

export const AppSettingProvider: FC<PropsWithChildren> = ({ children }) => {
  const appSetting = hooks.useAppSettings();

  const {
    mutateAsync: postAppSetting,
    isError: isPostError,
    isLoading: postLoading,
    isSuccess: postSuccess,
  } = mutations.usePostAppSetting();
  const {
    mutateAsync: patchAppSetting,
    isError: isPatchError,
    isLoading: patchLoading,
    isSuccess: patchSuccess,
  } = mutations.usePatchAppSetting();

  const isLoading = postLoading || patchLoading;
  const isSuccess = postSuccess || patchSuccess;

  const contextValue: AppSettingContextType = useMemo(
    () => ({
      postAppSetting,
      patchAppSetting,
      isPatchError,
      isPostError,
      isLoading,
      isSuccess,
      appSettingArray: appSetting.data || [],
    }),
    [
      appSetting.data,
      isLoading,
      isSuccess,
      patchAppSetting,
      isPatchError,
      postAppSetting,
      isPostError,
    ],
  );

  if (appSetting.isLoading) {
    return <Loader />;
  }

  return (
    <AppSettingContext.Provider value={contextValue}>
      {children}
    </AppSettingContext.Provider>
  );
};

export const useAppSettingContext = (): AppSettingContextType =>
  React.useContext<AppSettingContextType>(AppSettingContext);
