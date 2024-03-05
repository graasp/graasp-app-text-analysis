import { AppSetting } from '@graasp/sdk';

export const TEXT_RESOURCE_SETTING_KEY = 'text_resource_setting';
export const LESSON_TITLE_SETTING_KEY = 'lesson_title_setting';
export const KEYWORDS_SETTING_KEY = 'keywords_setting';
export const INITIAL_PROMPT_SETTING_KEY = 'initial_prompt_setting';
export const USE_CHATBOT_SETTING_KEY = 'use_chatbot_setting';
export const INITIAL_CHATBOT_PROMPT_SETTING_KEY =
  'initial_chatbot_prompt_setting';

export type TextResourceData = { text: string };
export type TextResourceSetting = AppSetting & { data: TextResourceData };
export type Keyword = { word: string; def: string };
// The label is the keyword with the same case as in the text
export type KeywordWithLabel = Keyword & { label: string };
export type KeywordsData = { keywords: Keyword[] };
export type KeywordsSetting = AppSetting & { data: KeywordsData };
export type UseChatbotData = { useBot: boolean };
export type UseChatbotSetting = AppSetting & { data: UseChatbotData };
