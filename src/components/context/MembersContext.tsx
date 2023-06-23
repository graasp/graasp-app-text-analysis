import { List } from 'immutable';

import React, { FC, ReactElement, createContext, useMemo } from 'react';

import { MemberRecord } from '@graasp/sdk/frontend';

import { hooks } from '../../config/queryClient';
import Loader from '../common/Loader';

export type MembersContextType = List<MemberRecord>;

const defaultContextValue = List<MemberRecord>();
const MembersContext = createContext<MembersContextType>(defaultContextValue);

type Prop = {
  children: ReactElement | ReactElement[];
};

export const MembersProvider: FC<Prop> = ({ children }) => {
  const appContext = hooks.useAppContext();

  const members = useMemo(() => {
    const updatedMembers = appContext.data?.get('members');

    return updatedMembers ?? defaultContextValue;
  }, [appContext.data]);

  if (appContext.isLoading) {
    return <Loader />;
  }

  return (
    <MembersContext.Provider value={members}>
      {children}
    </MembersContext.Provider>
  );
};

export const useMembersContext = (): MembersContextType =>
  React.useContext<MembersContextType>(MembersContext);
