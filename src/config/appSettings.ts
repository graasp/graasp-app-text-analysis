import { Context, PermissionLevel } from '@graasp/sdk';

import { KeywordsData, TextResourceData, keyword } from './appSettingTypes';

export const DEFAULT_TEXT_RESOURCE_SETTING: TextResourceData = {
  text: '',
};

export const DEFAULT_LESSON_TITLE: TextResourceData = {
  text: 'Your Lesson',
};

export const DEFAULT_KEYWORDS_LIST: KeywordsData = {
  keywords: [],
};

export const DEFAULT_KEYWORD: keyword = { word: '', def: '' };

export const DEFAULT_CONTEXT = Context.BUILDER;
export const DEFAULT_PERMISSION = PermissionLevel.Read;

export const DEFAULT_CONTEXT_LANGUAGE = 'en';
