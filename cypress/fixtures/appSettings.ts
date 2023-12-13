import { v4 } from 'uuid';

import { AppSetting } from '@graasp/sdk';

import {
  INITIAL_CHATBOT_PROMPT_SETTING_KEY,
  INITIAL_PROMPT_SETTING_KEY,
  KEYWORDS_SETTING_KEY,
  Keyword,
  TEXT_RESOURCE_SETTING_KEY,
  USE_CHATBOT_SETTING_KEY,
} from '../../src/config/appSettingTypes';
import { CURRENT_MEMBER, MOCK_SERVER_ITEM } from '../../src/data/db';

export const MOCK_TEXT_RESOURCE =
  'Lorem ipsum dolor sit amet. Ut optio laborum qui ducimus rerum eum illum possimus non quidem facere. A neque quia et placeat exercitationem vel necessitatibus Quis ea quod necessitatibus sit voluptas culpa ut laborum quia ad nobis numquam. Quo quibusdam maiores et numquam molestiae ut mollitia quaerat et voluptates autem qui expedita delectus aut aliquam expedita et odit incidunt. Id quia nulla est voluptate repellat non internos voluptatem sed cumque omnis et consequatur placeat qui illum aperiam eos consequatur suscipit.';

export const MOCK_KEYWORDS: Keyword[] = [
  { word: 'lorem', def: 'definition of lorem is blablabla' },
  { word: 'ispum', def: 'ipsum is blablabla' },
  { word: 'et', def: 'et means blablabla' },
  { word: 'expedita', def: 'expedita means blablabla' },
];

export const MOCK_TEXT_RESOURCE_SETTING: AppSetting = {
  id: v4(),
  name: TEXT_RESOURCE_SETTING_KEY,
  data: { text: MOCK_TEXT_RESOURCE },
  item: MOCK_SERVER_ITEM,
  creator: CURRENT_MEMBER,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const MOCK_KEYWORDS_SETTING: AppSetting = {
  id: v4(),
  name: KEYWORDS_SETTING_KEY,
  data: { keywords: MOCK_KEYWORDS },
  item: MOCK_SERVER_ITEM,
  creator: CURRENT_MEMBER,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const MOCK_INITIAL_PROMPT_SETTING: AppSetting = {
  id: v4(),
  name: INITIAL_PROMPT_SETTING_KEY,
  data: {
    text: 'This is a conversation between a chatbot who knows a lot of things about {{keyword}} and a student',
  },
  item: MOCK_SERVER_ITEM,
  creator: CURRENT_MEMBER,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const MOCK_INITIAL_CHATBOT_PROMPT_SETTING: AppSetting = {
  id: v4(),
  name: INITIAL_CHATBOT_PROMPT_SETTING_KEY,
  data: {
    text: 'Hello ! What do you want to know about {{keyword}} ?',
  },
  item: MOCK_SERVER_ITEM,
  creator: CURRENT_MEMBER,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const MOCK_USE_CHATBOT_SETTING: AppSetting = {
  id: v4(),
  name: USE_CHATBOT_SETTING_KEY,
  data: {
    useBot: true,
  },
  item: MOCK_SERVER_ITEM,
  creator: CURRENT_MEMBER,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const MOCK_APP_SETTINGS = [
  MOCK_TEXT_RESOURCE_SETTING,
  MOCK_KEYWORDS_SETTING,
  MOCK_INITIAL_PROMPT_SETTING,
  MOCK_INITIAL_CHATBOT_PROMPT_SETTING,
];

export const MOCK_APP_SETTINGS_USING_CHATBOT = [
  ...MOCK_APP_SETTINGS,
  MOCK_USE_CHATBOT_SETTING,
];
