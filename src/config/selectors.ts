import { CheckBoxState } from '@/components/common/table/types';

export const PLAYER_VIEW_CY = 'player_view';
export const BUILDER_VIEW_CY = 'builder_view';
export const APP_DATA_CONTAINER_CY = 'app_data_container';
export const APP_SETTING_CONTAINER_CY = 'app_setting_container';
export const NEW_APP_DATA_BUTTON_CY = 'new_app_data_button';
export const UPDATE_APP_SETTING_BUTTON_CY = 'update_app_setting_button';
export const SETTING_NAME_FIELD_CY = 'setting_name_field';
export const SETTING_VALUE_FIELD_CY = 'setting_value_field';
export const TEXT_DISPLAY_FIELD_CY = 'text_display_field';

export const ENTER_KEYWORD_FIELD_CY = 'enter_keyword_field';
export const ENTER_DEFINITION_FIELD_CY = 'enter_definition_field';
export const ADD_KEYWORD_BUTTON_CY = 'add_keyword_button';

export const CHATBOT_CONTAINER_CY = 'chatbot_container';
export const INITIAL_PROMPT_INPUT_FIELD_CY = 'initial_prompt_input_field';

export const INITIAL_CHATBOT_PROMPT_INPUT_FIELD_CY =
  'initial_chatbot_prompt_input_field';

export const USE_CHATBOT_DATA_CY = 'use_chatbot_data_cy';

export const TEXT_INPUT_FIELD_CY = 'text_input_field';
export const TITLE_INPUT_FIELD_CY = 'title_input_field';

export const SHOW_KEYWORDS_BUTTON_CY = 'show_keywords_button';
export const BANNER_CY = 'banner';
export const KEYWORD_BUTTON_CY = 'keyword_button';

export const CHAT_WINDOW_CY = 'chat_window';
export const DICTIONNARY_MODE_CY = 'dictionnary_mode';
export const CHATBOT_MODE_CY = 'chatbot_mode_cy';

export const SETTINGS_SAVE_BUTTON_CY = 'settings_save_button';

// editable table
const removeRowIdSpaces = (rowId: string): string => rowId.replaceAll(' ', '-');
export const EDITABLE_TABLE_CY = 'editable_table';
export const EDITABLE_TABLE_ROW_CY = 'editable_table_row';
export const EDITABLE_TABLE_FILTER_INPUT_CY = 'editable_table_filter_input';
export const EDITABLE_TABLE_DELETE_SELECTION_BUTTON_CY =
  'editable_table_delete_selection_button';
export const EDITABLE_TABLE_SAVE_ALL_BUTTON_CY =
  'editable_table_save_all_button';
export const EDITABLE_TABLE_DISCARD_ALL_BUTTON_CY =
  'editable_table_discard_all_button';
export const EDITABLE_TABLE_NO_DATA_CY = 'edit_table_no_data';
export const EDITABLE_TABLE_FILTER_NO_RESULT_CY = 'edit_table_filter_no_result';
export const buildEditableSelectAllButtonCy = (state: CheckBoxState): string =>
  `editable_table_select_all_button_${state}`;
export const buildEditableTableSelectButtonCy = (
  rowId: string,
  isChecked: boolean,
): string =>
  `editable_table_${removeRowIdSpaces(rowId)}_select_button_${isChecked}`;
export const buildEditableTableEditButtonCy = (rowId: string): string =>
  `editable_table_${removeRowIdSpaces(rowId)}_edit_button`;
export const buildEditableTableDeleteButtonCy = (rowId: string): string =>
  `editable_table_${removeRowIdSpaces(rowId)}_delete_button`;
export const buildEditableTableSaveButtonCy = (rowId: string): string =>
  `editable_table_${removeRowIdSpaces(rowId)}_save_button`;
export const buildEditableTableDiscardButtonCy = (rowId: string): string =>
  `editable_table_${removeRowIdSpaces(rowId)}_discard_button`;
export const buildEditableTableTextInputCy = (
  rowId: string,
  columnName: string,
  readonly: boolean,
): string =>
  `editable_table_${removeRowIdSpaces(
    rowId,
  )}_${columnName}_text_input_${readonly}`;

export const buildKeywordTextInputCy = (
  keyword: string,
  readonly: boolean,
): string => buildEditableTableTextInputCy(keyword, 'word', readonly);
export const buildKeywordDefinitionTextInputCy = (
  keyword: string,
  readonly: boolean,
): string => buildEditableTableTextInputCy(keyword, 'def', readonly);

export const buildKeywordNotExistWarningCy = (keyword: string): string =>
  `keyword_${removeRowIdSpaces(keyword)}_not_in_text_warning`;

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
