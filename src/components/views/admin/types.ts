import {
  INITIAL_CHATBOT_PROMPT_SETTING_KEY,
  INITIAL_PROMPT_SETTING_KEY,
  KEYWORDS_SETTING_KEY,
  Keyword,
  LESSON_TITLE_SETTING_KEY,
  TEXT_RESOURCE_SETTING_KEY,
  USE_CHATBOT_SETTING_KEY,
} from '@/config/appSettingTypes';
import {
  DEFAULT_TEXT_RESOURCE_SETTING,
  DEFAULT_USE_CHATBOT_SETTING,
} from '@/config/appSettings';

export const DATA_KEYS = {
  TEXT: 'text',
  USE_BOT: 'useBot',
  KEYWORDS: 'keywords',
} as const;

export const defaultSettings = {
  [LESSON_TITLE_SETTING_KEY]: {
    value: DEFAULT_TEXT_RESOURCE_SETTING.text,
    dataKey: DATA_KEYS.TEXT,
  },
  [TEXT_RESOURCE_SETTING_KEY]: {
    value: DEFAULT_TEXT_RESOURCE_SETTING.text,
    dataKey: DATA_KEYS.TEXT,
  },
  [USE_CHATBOT_SETTING_KEY]: {
    value: DEFAULT_USE_CHATBOT_SETTING.useBot,
    dataKey: DATA_KEYS.USE_BOT,
  },
  [INITIAL_PROMPT_SETTING_KEY]: {
    value: DEFAULT_TEXT_RESOURCE_SETTING.text,
    dataKey: DATA_KEYS.TEXT,
  },
  [INITIAL_CHATBOT_PROMPT_SETTING_KEY]: {
    value: DEFAULT_TEXT_RESOURCE_SETTING.text,
    dataKey: DATA_KEYS.TEXT,
  },
  [KEYWORDS_SETTING_KEY]: {
    value: [] as Keyword[],
    dataKey: DATA_KEYS.KEYWORDS,
  },
};
export type SettingKey = keyof typeof defaultSettings;
export type SettingValue = (typeof defaultSettings)[SettingKey]['value'];

export const settingKeys = Object.keys(defaultSettings).map(
  (k) => k as SettingKey,
);
