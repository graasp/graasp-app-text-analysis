import React, { FC, PropsWithChildren, createContext, useMemo } from 'react';

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

type DeleteAppSettingType = {
  id: string;
};

export type AppSettingContextType = {
  postAppSetting: (payload: PostAppSettingType) => void;
  patchAppSetting: (payload: PatchAppSettingType) => void;
  deleteAppSetting: (payload: DeleteAppSettingType) => void;
  appSettingArray: AppSetting[];
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
};

const defaultContextValue = {
  postAppSetting: () => null,
  patchAppSetting: () => null,
  deleteAppSetting: () => null,
  appSettingArray: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
};

const AppSettingContext =
  createContext<AppSettingContextType>(defaultContextValue);

export const AppSettingProvider: FC<PropsWithChildren> = ({ children }) => {
  const appSetting = hooks.useAppSettings();

  const {
    mutate: postAppSetting,
    isError: postError,
    isLoading: postLoading,
    isSuccess: postSuccess,
  } = mutations.usePostAppSetting();
  const {
    mutate: patchAppSetting,
    isError: patchError,
    isLoading: patchLoading,
    isSuccess: patchSuccess,
  } = mutations.usePatchAppSetting();
  const {
    mutate: deleteAppSetting,
    isError: deleteError,
    isLoading: deleteLoading,
    isSuccess: deleteSuccess,
  } = mutations.useDeleteAppSetting();

  const isError = postError || patchError || deleteError;
  const isLoading = postLoading || patchLoading || deleteLoading;
  const isSuccess = postSuccess || patchSuccess || deleteSuccess;

  const contextValue: AppSettingContextType = useMemo(
    () => ({
      postAppSetting,
      patchAppSetting,
      deleteAppSetting,
      isError,
      isLoading,
      isSuccess,
      appSettingArray: appSetting.data || [],
    }),
    [
      appSetting.data,
      deleteAppSetting,
      isError,
      isLoading,
      isSuccess,
      patchAppSetting,
      postAppSetting,
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
