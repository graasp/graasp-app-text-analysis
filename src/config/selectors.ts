export const PLAYER_VIEW_CY = 'player_view';
export const BUILDER_VIEW_CY = 'builder_view';
export const APP_DATA_CONTAINER_CY = 'app_data_container';
export const APP_SETTING_CONTAINER_CY = 'app_setting_container';
export const NEW_APP_DATA_BUTTON_CY = 'new_app_data_button';
export const UPDATE_APP_SETTING_BUTTON_CY = 'update_app_setting_button';
export const SETTING_NAME_FIELD_CY = 'setting_name_field';
export const SETTING_VALUE_FIELD_CY = 'setting_value_field';
export const TEXT_DISPLAY_FIELD_CY = 'text_display_field';

export const KEYWORD_LIST_ITEM_CY = 'keyword_list_item';
export const ENTER_KEYWORD_FIELD_CY = 'enter_keyword_field';
export const DELETE_KEYWORD_BUTTON_CY = 'delete_keyword_button';
export const SAVE_KEYWORDS_BUTTON_CY = 'save_keywords_button';

export const INITIAL_PROMPT_INPUT_FIELD_CY = 'initial_prompt_input_field';
export const INITIAL_PROMPT_BUTTON_CY = 'initial_prompt_button';

export const INITIAL_CHATBOT_PROMPT_INPUT_FIELD_CY =
  'initial_chatbot_prompt_input_field';
export const INITIAL_CHATBOT_PROMPT_BUTTON_CY = 'initial_chatbot_prompt_button';

export const USE_CHATBOT_DATA_CY = 'use_chatbot_data_cy';

export const TEXT_INPUT_FIELD_CY = 'text_input_field';
export const TITLE_INPUT_FIELD_CY = 'title_input_field';
export const SAVE_TITLE_BUTTON_CY = 'save_title_button';
export const SAVE_TEXT_BUTTON_CY = 'save_text_button';

export const SUMMON_BUTTON_CY = 'summon_button';
export const BANNER_CY = 'banner';
export const KEYWORD_BUTTON_CY = 'keyword_button';

export const CHAT_WINDOW_CY = 'chat_window';
export const DICTIONNARY_MODE_CY = 'dictionnary_mode';
export const CHATBOT_MODE_CY = 'chatbot_mode_cy';

export const buildDataCy = (selector: string): string =>
  `[data-cy=${selector}]`;

export const buildTextFieldSelectorCy = (selector: string): string =>
  `${buildDataCy(selector)} input`;

export const KEYWORD_BUTTON_SUFFIX = '-keyword_button';
export const MESSAGE_PREFIX = 'message-';

export const keywordDataCy = (keyword: string): string =>
  `${keyword}${KEYWORD_BUTTON_SUFFIX}`;

export const messagesDataCy = (id: string): string => `${MESSAGE_PREFIX}${id}`;

export const buildAllKeywordsButtonDataCy = (): string =>
  `[data-cy$=${KEYWORD_BUTTON_SUFFIX}]`;
