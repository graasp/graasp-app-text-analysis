import { v4 as uuid } from 'uuid';

import { AppData, AppDataVisibility } from '@graasp/sdk';

import { APP_DATA_TYPES } from '../../src/config/appDataTypes';
import { CURRENT_MEMBER, MOCK_SERVER_ITEM } from '../../src/data/db';

export const MOCK_SERVER_API_HOST = 'http://localhost:3636';

export const MOCK_APP_DATA: AppData[] = [
  {
    id: uuid(),
    data: {
      message: 'Hello, what do you want to know about lorem?',
      keyword: 'lorem',
    },
    member: CURRENT_MEMBER,
    creator: CURRENT_MEMBER,
    item: MOCK_SERVER_ITEM,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: APP_DATA_TYPES.BOT_COMMENT,
    visibility: AppDataVisibility.Member,
  },
  {
    id: uuid(),
    data: {
      message: 'Give me its definition',
      keyword: 'lorem',
    },
    member: CURRENT_MEMBER,
    creator: CURRENT_MEMBER,
    item: MOCK_SERVER_ITEM,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: APP_DATA_TYPES.STUDENT_COMMENT,
    visibility: AppDataVisibility.Member,
  },
  {
    id: uuid(),
    data: {
      message: 'Lorem is blablabla. Do you want to know more about it ?',
      keyword: 'lorem',
    },
    member: CURRENT_MEMBER,
    creator: CURRENT_MEMBER,
    item: MOCK_SERVER_ITEM,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: APP_DATA_TYPES.BOT_COMMENT,
    visibility: AppDataVisibility.Member,
  },
  {
    id: uuid(),
    data: {
      message: 'No it is clear, but can you talk about something else?',
      keyword: 'lorem',
    },
    member: CURRENT_MEMBER,
    creator: CURRENT_MEMBER,
    item: MOCK_SERVER_ITEM,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: APP_DATA_TYPES.STUDENT_COMMENT,
    visibility: AppDataVisibility.Member,
  },
  {
    id: uuid(),
    data: {
      message: "Sorry I can't",
      keyword: 'lorem',
    },
    member: CURRENT_MEMBER,
    creator: CURRENT_MEMBER,
    item: MOCK_SERVER_ITEM,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: APP_DATA_TYPES.BOT_COMMENT,
    visibility: AppDataVisibility.Member,
  },
];
