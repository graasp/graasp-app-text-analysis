import { v4 as uuid } from 'uuid';

import { AppData, AppDataVisibility } from '@graasp/sdk';

import { AppDataTypes } from '../../src/config/appDataTypes';
import { MOCK_SERVER_ITEM } from './item';
import { CURRENT_MEMBER } from './members';

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
    type: AppDataTypes.BOT_COMMENT,
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
    type: AppDataTypes.STUDENT_COMMENT,
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
    type: AppDataTypes.BOT_COMMENT,
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
    type: AppDataTypes.STUDENT_COMMENT,
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
    type: AppDataTypes.BOT_COMMENT,
    visibility: AppDataVisibility.Member,
  },
];
