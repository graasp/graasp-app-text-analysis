import React, { FC, PropsWithChildren, createContext, useMemo } from 'react';

import { AppData, AppDataVisibility } from '@graasp/sdk';

import { hooks, mutations } from '../../config/queryClient';
import Loader from '../common/Loader';

type PostAppDataType = {
  data: { [key: string]: unknown };
  type: string;
  visibility?: AppDataVisibility;
};

type PatchAppDataType = {
  data: { [key: string]: unknown };
  id: string;
};

type DeleteAppDataType = {
  id: string;
};

export type AppDataContextType = {
  postAppData: (payload: PostAppDataType) => void;
  postAppDataAsync: (payload: PostAppDataType) => Promise<AppData> | null;
  patchAppData: (payload: PatchAppDataType) => void;
  deleteAppData: (payload: DeleteAppDataType) => void;
  appDataArray: AppData[];
};

const defaultContextValue = {
  postAppData: () => null,
  postAppDataAsync: () => null,
  patchAppData: () => null,
  deleteAppData: () => null,
  appDataArray: [],
};

const AppDataContext = createContext<AppDataContextType>(defaultContextValue);

export const AppDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const appData = hooks.useAppData();

  const { mutate: postAppData, mutateAsync: postAppDataAsync } =
    mutations.usePostAppData();
  const { mutate: patchAppData } = mutations.usePatchAppData();
  const { mutate: deleteAppData } = mutations.useDeleteAppData();
  const contextValue: AppDataContextType = useMemo(
    () => ({
      postAppData: (payload: PostAppDataType) => {
        postAppData(payload);
      },
      postAppDataAsync: (payload: PostAppDataType) => postAppDataAsync(payload),
      patchAppData,
      deleteAppData,
      appDataArray: appData.data || [],
    }),
    [appData.data, deleteAppData, patchAppData, postAppData, postAppDataAsync],
  );

  if (appData.isLoading) {
    return <Loader />;
  }

  return (
    <AppDataContext.Provider value={contextValue}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppDataContext = (): AppDataContextType =>
  React.useContext<AppDataContextType>(AppDataContext);
