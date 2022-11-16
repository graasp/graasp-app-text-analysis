import { AppSetting } from '@graasp/apps-query-client';

export const TEXT_RESOURCE_SETTING_KEY = 'text_resource_setting';
export const LESSON_TITLE_SETTING_KEY = 'lesson_title_setting';
export const KEYWORDS_SETTING_KEY = 'keywords_setting';

export type TextResourceData = { text: string };
export type TextResourceSetting = AppSetting & { data: TextResourceData };

export type KeywordsData = { keywords: string[] };
export type KeywordsSetting = AppSetting & { data: KeywordsData };
