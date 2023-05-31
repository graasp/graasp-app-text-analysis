import { List } from 'immutable';

import React, { FC, PropsWithChildren, createContext, useMemo } from 'react';

import { AppSettingRecord } from '@graasp/sdk/frontend';

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
  appSettingArray: List<AppSettingRecord>;
};

const defaultContextValue = {
  postAppSetting: () => null,
  patchAppSetting: () => null,
  deleteAppSetting: () => null,
  appSettingArray: List<AppSettingRecord>(),
};

const AppSettingContext =
  createContext<AppSettingContextType>(defaultContextValue);

export const AppSettingProvider: FC<PropsWithChildren> = ({ children }) => {
  const appSetting = hooks.useAppSettings();

  const { mutate: postAppSetting } = mutations.usePostAppSetting();
  const { mutate: patchAppSetting } = mutations.usePatchAppSetting();
  const { mutate: deleteAppSetting } = mutations.useDeleteAppSetting();
  const contextValue: AppSettingContextType = useMemo(
    () => ({
      postAppSetting,
      patchAppSetting,
      deleteAppSetting,
      appSettingArray: appSetting.data || List(),
    }),
    [appSetting.data, deleteAppSetting, patchAppSetting, postAppSetting],
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
