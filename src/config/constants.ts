import { TextResourceData } from './appSettingTypes';

export const ANONYMOUS_USER = 'Anonymous';
export const ENTER_KEY = 'Enter';
export const FIRST_CHATBOT_MESSAGE: TextResourceData = {
  text: 'You clicked on {{keyword}}, what do you want to know about it ?',
};
export const END_CONVERSATION =
  'Sorry, you reach your maximal number of questions !';

export const MAX_CONVERSATION_LENGTH = 20;
export const MAX_CONVERSATION_LENGTH_ALERT =
  'You have reached the maximum number of messages allowed in the conversation';

export const SCROLL_SAFETY_MARGIN = 64;

export const DICTIONARY_API_BASE_URL =
  'https://api.dictionaryapi.dev/api/v2/entries/en/';
