import { v4 } from 'uuid';

import { AppSetting } from '@graasp/apps-query-client';

import {
  KEYWORDS_KEY,
  TEXT_RESOURCE_KEY,
} from '../../src/config/appSettingTypes';
import { MOCK_SERVER_ITEM } from './appData';
import { CURRENT_MEMBER } from './members';

export const MOCK_TEXT_RESOURCE =
  'Lorem ipsum dolor sit amet. Ut optio laborum qui ducimus rerum eum illum possimus non quidem facere. A neque quia et placeat exercitationem vel necessitatibus Quis ea quod necessitatibus sit voluptas culpa ut laborum quia ad nobis numquam. Quo quibusdam maiores et numquam molestiae ut mollitia quaerat et voluptates autem qui expedita delectus aut aliquam expedita et odit incidunt. Id quia nulla est voluptate repellat non internos voluptatem sed cumque omnis et consequatur placeat qui illum aperiam eos consequatur suscipit.';

export const MOCK_KEYWORDS = ['ipsum', 'et', 'expedita'];

export const MOCK_TEXT_RESOURCE_SETTING: AppSetting = {
  id: v4(),
  name: TEXT_RESOURCE_KEY,
  data: { text: MOCK_TEXT_RESOURCE },
  itemId: MOCK_SERVER_ITEM.id,
  creator: CURRENT_MEMBER.id,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const MOCK_KEYWORDS_SETTING: AppSetting = {
  id: v4(),
  name: KEYWORDS_KEY,
  data: { keywords: MOCK_KEYWORDS },
  itemId: MOCK_SERVER_ITEM.id,
  creator: CURRENT_MEMBER.id,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const MOCK_APP_SETTINGS = [
  MOCK_TEXT_RESOURCE_SETTING,
  MOCK_KEYWORDS_SETTING,
];
