import { Context, PermissionLevel } from '@graasp/sdk';

import { Keyword, KeywordsData, TextResourceData } from './appSettingTypes';

export const DEFAULT_TEXT_RESOURCE_SETTING: TextResourceData = {
  text: '',
};

export const DEFAULT_LESSON_TITLE: TextResourceData = {
  text: 'Your Lesson',
};

export const DEFAULT_KEYWORDS_LIST: KeywordsData = {
  keywords: [],
};

export const DEFAULT_INITIAL_PROMPT: TextResourceData = {
  text: '',
};

export const DEFAULT_USE_CHATBOT_SETTING = { useBot: false };

export const DEFAULT_KEYWORD: Keyword = { word: '', def: '' };

export const DEFAULT_CONTEXT = Context.Builder;
export const DEFAULT_PERMISSION = PermissionLevel.Read;

export const DEFAULT_CONTEXT_LANGUAGE = 'en';
