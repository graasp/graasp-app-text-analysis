import { v4 } from 'uuid';

import type { Database, LocalContext, Member } from '@graasp/apps-query-client';

import { APP_DATA_TYPES } from '../config/appDataTypes';
import { TEXT_RESOURCE_KEY } from '../config/appSettingTypes';
import { DEFAULT_TEXT_RESOURCE_SETTING } from '../config/appSettings';
import { REACT_APP_API_HOST } from '../config/env';

export const mockContext: LocalContext = {
  apiHost: REACT_APP_API_HOST,
  permission: 'admin',
  context: 'builder',
  itemId: '1234-1234-123456-8123-123456',
  memberId: 'mock-member-id',
};

export const mockMembers: Member[] = [
  {
    id: mockContext.memberId || '',
    name: 'current-member',
    email: 'current@graasp.org',
    extra: {},
  },
  {
    id: 'mock-member-id-2',
    name: 'mock-member-2',
    email: 'other-member@graasp.org',
    extra: {},
  },
];

const buildDatabase = (
  appContext: Partial<LocalContext>,
  members?: Member[],
): Database => ({
  appData: [
    {
      id: v4(),
      data: {
        content: '',
      },
      memberId: mockMembers[1].id,
      type: APP_DATA_TYPES.MOCK_TYPE,
      itemId: appContext.itemId || '',
      creator: mockMembers[1].id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: v4(),
      data: {
        content: 'Another AppData',
      },
      memberId: mockMembers[0].id,
      type: APP_DATA_TYPES.MOCK_TYPE,
      itemId: appContext.itemId || '',
      creator: mockMembers[1].id,
      createdAt: new Date(Date.now() - 1500).toISOString(),
      updatedAt: new Date(Date.now() - 1500).toISOString(),
    },
  ],
  appActions: [],
  members: members ?? mockMembers,
  appSettings: [
    {
      id: v4(),
      name: TEXT_RESOURCE_KEY,
      data: {
        ...DEFAULT_TEXT_RESOURCE_SETTING,
        text: 'Lorem ipsum dolor sit amet. A dolorum impedit et fugit doloribus quo asperiores aliquid qui ullam omnis sed reiciendis minus et galisum Quis et quaerat asperiores! Eum doloremque quam eum similique optio ex atque distinctio. Et magnam neque qui galisum modi et aliquid doloremque aut ipsam amet aut eligendi  et omnis voluptate. 33 expedita voluptatibus id consequatur eveniet hic nihil iste non molestiae rerum et debitis obcaecati eos quam itaque et neque corrupti.',
        // todo: place here any setting you would like to overwrite
        // settingKey: value
      },
      itemId: appContext.itemId || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      creator: mockMembers[0].id,
    },
  ],
});

export default buildDatabase;
