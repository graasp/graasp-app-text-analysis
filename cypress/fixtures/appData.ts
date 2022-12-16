import { v4 as uuid } from 'uuid';

import { AppData } from '@graasp/apps-query-client';

import { APP_DATA_TYPES } from '../../src/config/appDataTypes';
import { CURRENT_MEMBER } from './members';

export const MOCK_SERVER_ITEM = { id: '1234567890' };

export const MOCK_SERVER_API_HOST = 'http://localhost:3636';

export const MOCK_APP_DATA: AppData[] = [
  {
    id: uuid(),
    data: {
      message: 'Hello, what do you want to know about lorem?',
      keyword: 'lorem',
    },
    memberId: CURRENT_MEMBER.id,
    creator: CURRENT_MEMBER.id,
    itemId: MOCK_SERVER_ITEM.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: APP_DATA_TYPES.BOT_COMMENT,
  },
  {
    id: uuid(),
    data: {
      message: 'Give me its definition',
      keyword: 'lorem',
    },
    memberId: CURRENT_MEMBER.id,
    creator: CURRENT_MEMBER.id,
    itemId: MOCK_SERVER_ITEM.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: APP_DATA_TYPES.STUDENT_COMMENT,
  },
  {
    id: uuid(),
    data: {
      message: 'Lorem is blablabla. Do you want to know more about it ?',
      keyword: 'lorem',
    },
    memberId: CURRENT_MEMBER.id,
    creator: CURRENT_MEMBER.id,
    itemId: MOCK_SERVER_ITEM.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: APP_DATA_TYPES.BOT_COMMENT,
  },
  {
    id: uuid(),
    data: {
      message: 'No it is clear, but can you talk about something else?',
      keyword: 'lorem',
    },
    memberId: CURRENT_MEMBER.id,
    creator: CURRENT_MEMBER.id,
    itemId: MOCK_SERVER_ITEM.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: APP_DATA_TYPES.STUDENT_COMMENT,
  },
  {
    id: uuid(),
    data: {
      message: "Sorry I can't",
      keyword: 'lorem',
    },
    memberId: CURRENT_MEMBER.id,
    creator: CURRENT_MEMBER.id,
    itemId: MOCK_SERVER_ITEM.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: APP_DATA_TYPES.BOT_COMMENT,
  },
];
