import { v4 } from 'uuid';

import type { Database, LocalContext } from '@graasp/apps-query-client';
import { Item, Member, MemberType, PermissionLevel } from '@graasp/sdk';

import {
  LESSON_TITLE_SETTING_KEY,
  TEXT_RESOURCE_SETTING_KEY,
} from '../config/appSettingTypes';
import {
  DEFAULT_LESSON_TITLE,
  DEFAULT_TEXT_RESOURCE_SETTING,
} from '../config/appSettings';
import { REACT_APP_API_HOST } from '../config/env';

export const MOCK_SERVER_ITEM = { id: '1234567890' } as Item;

export const MEMBERS: { [key: string]: Member } = {
  ANNA: {
    id: '0f0a2774-a965-4b97-afb4-bccc3796e060',
    name: 'anna',
    type: MemberType.Individual,
    createdAt: new Date(),
    updatedAt: new Date(),
    email: 'anna@email.com',
    extra: {},
  },
  BOB: {
    id: '1f0a2774-a965-4b97-afb4-bccc3796e060',
    name: 'bob',
    type: MemberType.Individual,
    createdAt: new Date(),
    updatedAt: new Date(),
    email: 'bob@email.com',
    extra: {},
  },
};

export const CURRENT_MEMBER = MEMBERS.ANNA;

export const mockContext: LocalContext = {
  apiHost: REACT_APP_API_HOST,
  permission: PermissionLevel.Admin,
  context: 'player',
  itemId: MOCK_SERVER_ITEM.id,
  memberId: CURRENT_MEMBER.id,
};

const buildDatabase = (
  appContext: Partial<LocalContext>,
  members?: Member[],
): Database => ({
  appData: [],
  appActions: [],
  members: members ?? Object.values(MEMBERS),
  appSettings: [
    {
      id: v4(),
      name: TEXT_RESOURCE_SETTING_KEY,
      data: {
        ...DEFAULT_TEXT_RESOURCE_SETTING,
        text: 'Here is my wonderful text',
        // todo: place here any setting you would like to overwrite
        // settingKey: value
      },
      item: MOCK_SERVER_ITEM,
      createdAt: new Date(),
      updatedAt: new Date(),
      creator: CURRENT_MEMBER,
    },
    {
      id: v4(),
      name: LESSON_TITLE_SETTING_KEY,
      data: {
        ...DEFAULT_LESSON_TITLE,
        text: '',
        // todo: place here any setting you would like to overwrite
        // settingKey: value
      },
      item: MOCK_SERVER_ITEM,
      createdAt: new Date(),
      updatedAt: new Date(),
      creator: CURRENT_MEMBER,
    },
  ],
  items: [MOCK_SERVER_ITEM],
});

export default buildDatabase;
