import React, { FC, PropsWithChildren, createContext, useMemo } from 'react';

import { AppSetting } from '@graasp/sdk';

import {
  CommandContext,
  CommandDataType,
  DeleteCommandDataType,
  PatchCommandDataType,
  PostCommandDataType,
} from '@/commands/commands';

import { hooks, mutations } from '../../config/queryClient';
import Loader from '../common/Loader';

export type AppSettingContextType = {
  settingContext: CommandContext<CommandDataType>;
  appSettingArray: AppSetting[];
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
};

const defaultContextValue = {
  settingContext: {
    update: () => null,
    create: () => null,
    delete: () => null,
  },
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

  const settingContext: CommandContext<CommandDataType> = useMemo(
    () => ({
      update: (payload: PatchCommandDataType) => {
        patchAppSetting({
          data: { ...payload.data },
          id: payload.id,
        });
      },
      create: (payload: PostCommandDataType) => {
        postAppSetting({
          data: { ...payload.data },
          name: payload.name,
        });
      },
      delete: (payload: DeleteCommandDataType) => {
        deleteAppSetting({
          id: payload.id,
        });
      },
    }),
    [deleteAppSetting, patchAppSetting, postAppSetting],
  );

  const contextValue: AppSettingContextType = useMemo(
    () => ({
      settingContext,
      isError,
      isLoading,
      isSuccess,
      appSettingArray: appSetting.data || [],
    }),
    [appSetting.data, isError, isLoading, isSuccess, settingContext],
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
