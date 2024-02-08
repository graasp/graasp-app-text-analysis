import React, { FC, PropsWithChildren, createContext, useMemo } from 'react';

import { AppSetting } from '@graasp/sdk';

import {
  APIContext,
  CommandDataType,
  DeleteCommandDataType,
  PatchCommandDataType,
  PostCommandDataType,
} from '@/commands/commands';

import { hooks, mutations } from '../../config/queryClient';
import Loader from '../common/Loader';

export type AppSettingContextType = {
  settingContext: APIContext<CommandDataType>;
  appSettingArray: AppSetting[];
};

const defaultContextValue = {
  settingContext: {
    patch: () => null,
    post: () => null,
    delete: () => null,
  },
  appSettingArray: [],
};

const AppSettingContext =
  createContext<AppSettingContextType>(defaultContextValue);

export const AppSettingProvider: FC<PropsWithChildren> = ({ children }) => {
  const appSetting = hooks.useAppSettings();

  const { mutate: postAppSetting } = mutations.usePostAppSetting();
  const { mutate: patchAppSetting } = mutations.usePatchAppSetting();
  const { mutate: deleteAppSetting } = mutations.useDeleteAppSetting();

  const settingContext: APIContext<CommandDataType> = useMemo(
    () => ({
      patch: (payload: PatchCommandDataType) => {
        patchAppSetting({
          data: { ...payload.data },
          id: payload.id,
        });
      },
      post: (payload: PostCommandDataType) => {
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
      appSettingArray: appSetting.data || [],
    }),
    [appSetting.data, settingContext],
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
