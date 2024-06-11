import { v4 } from 'uuid';

import type { Database, LocalContext } from '@graasp/apps-query-client';
import {
  CompleteMember,
  Context,
  DiscriminatedItem,
  MemberFactory,
  MemberType,
  PermissionLevel,
} from '@graasp/sdk';

import {
  LESSON_TITLE_SETTING_KEY,
  TEXT_RESOURCE_SETTING_KEY,
} from '../config/appSettingTypes';
import {
  DEFAULT_LESSON_TITLE,
  DEFAULT_TEXT_RESOURCE_SETTING,
} from '../config/appSettings';
import { GRAASP_API_HOST } from '../config/env';

export const MOCK_SERVER_ITEM = { id: '1234567890' } as DiscriminatedItem;

export const MEMBERS: { [key: string]: CompleteMember } = {
  ANNA: MemberFactory({
    id: '0f0a2774-a965-4b97-afb4-bccc3796e060',
    name: 'anna',
    type: MemberType.Individual,
    email: 'anna@email.com',
  }),
  BOB: MemberFactory({
    id: '1f0a2774-a965-4b97-afb4-bccc3796e060',
    name: 'bob',
    type: MemberType.Individual,
    email: 'bob@email.com',
  }),
};

export const CURRENT_MEMBER = MEMBERS.ANNA;

export const mockContext: LocalContext = {
  apiHost: GRAASP_API_HOST,
  permission: PermissionLevel.Admin,
  context: Context.Player,
  itemId: MOCK_SERVER_ITEM.id,
  memberId: CURRENT_MEMBER.id,
};

export const mockMembers = Object.values(MEMBERS);

const buildDatabase = (members: CompleteMember[]): Database => ({
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      creator: CURRENT_MEMBER,
    },
  ],
  items: [MOCK_SERVER_ITEM],
});

export default buildDatabase;
