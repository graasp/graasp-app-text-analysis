import { TextResourceData } from './appSettingTypes';

export const ANONYMOUS_USER = 'Anonymous';
export const ENTER_KEY = 'Enter';
export const { REACT_APP_OPEN_AI_URL: CHATBOT_RESPONSE_URL = 'url not found' } =
  process.env;
export const FIRST_CHATBOT_MESSAGE: TextResourceData = {
  text: 'You clicked on {{keyword}}, what do you want to know about it ?',
};
export const END_CONVERSATION =
  'Sorry, you reach your maximal number of questions !';

export const MAX_CONVERSATION_LENGTH = 20;

export const STUDENT_PREFIX = 'Student';
export const CHATBOT_PREFIX = 'Chatbot';

export const SCROLL_SAFETY_MARGIN = 64;

export const DICTIONARY_API_BASE_URL =
  'https://api.dictionaryapi.dev/api/v2/entries/en/';
