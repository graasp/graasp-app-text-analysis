import { FC, useEffect, useState } from 'react';

import { Alert, Box, Typography } from '@mui/material';

import {
  INITIAL_CHATBOT_PROMPT_SETTING_KEY,
  INITIAL_PROMPT_SETTING_KEY,
  KEYWORDS_SETTING_KEY,
  Keyword,
  LESSON_TITLE_SETTING_KEY,
  TEXT_RESOURCE_SETTING_KEY,
  USE_CHATBOT_SETTING_KEY,
} from '../../../config/appSettingTypes';
import {
  DEFAULT_TEXT_RESOURCE_SETTING,
  DEFAULT_USE_CHATBOT_SETTING,
} from '../../../config/appSettings';
import {
  BUILDER_VIEW_CY,
  CHATBOT_CONTAINER_CY,
  INITIAL_CHATBOT_PROMPT_INPUT_FIELD_CY,
  INITIAL_PROMPT_INPUT_FIELD_CY,
  SETTINGS_SAVE_BUTTON_CY,
  TEXT_INPUT_FIELD_CY,
  TITLE_INPUT_FIELD_CY,
} from '../../../config/selectors';
import { DEFAULT_MARGIN } from '../../../config/stylingConstants';
import { getAppSetting } from '../../../utils/appSettings';
import PublicAlert from '../../common/PublicAlert';
import GraaspButton from '../../common/settings/GraaspButton';
import KeyWords from '../../common/settings/KeyWords';
import SetText from '../../common/settings/SetText';
import SwitchModes from '../../common/settings/SwitchModes';
import { useAppSettingContext } from '../../context/AppSettingContext';

const defaultSettings = {
  [LESSON_TITLE_SETTING_KEY]: {
    defaultValue: DEFAULT_TEXT_RESOURCE_SETTING.text,
    dataKey: 'text',
  },
  [TEXT_RESOURCE_SETTING_KEY]: {
    defaultValue: DEFAULT_TEXT_RESOURCE_SETTING.text,
    dataKey: 'text',
  },
  [USE_CHATBOT_SETTING_KEY]: {
    defaultValue: DEFAULT_USE_CHATBOT_SETTING.useBot,
    dataKey: 'useBot',
  },
  [INITIAL_PROMPT_SETTING_KEY]: {
    defaultValue: DEFAULT_TEXT_RESOURCE_SETTING.text,
    dataKey: 'text',
  },
  [INITIAL_CHATBOT_PROMPT_SETTING_KEY]: {
    defaultValue: DEFAULT_TEXT_RESOURCE_SETTING.text,
    dataKey: 'text',
  },
  [KEYWORDS_SETTING_KEY]: {
    defaultValue: [] as Keyword[],
    dataKey: 'keywords',
  },
};

const BuilderView: FC = () => {
  const [settings, setSettings] = useState({
    [LESSON_TITLE_SETTING_KEY]:
      defaultSettings[LESSON_TITLE_SETTING_KEY].defaultValue,
    [TEXT_RESOURCE_SETTING_KEY]:
      defaultSettings[TEXT_RESOURCE_SETTING_KEY].defaultValue,
    [USE_CHATBOT_SETTING_KEY]:
      defaultSettings[USE_CHATBOT_SETTING_KEY].defaultValue,
    [INITIAL_PROMPT_SETTING_KEY]:
      defaultSettings[INITIAL_PROMPT_SETTING_KEY].defaultValue,
    [INITIAL_CHATBOT_PROMPT_SETTING_KEY]:
      defaultSettings[INITIAL_CHATBOT_PROMPT_SETTING_KEY].defaultValue,
    [KEYWORDS_SETTING_KEY]: defaultSettings[KEYWORDS_SETTING_KEY].defaultValue,
  });

  type SettingKey = keyof typeof settings;
  type SettingValue = (typeof settings)[SettingKey];

  const updateSettingState = <K extends SettingKey, V extends SettingValue>(
    settingKey: K,
    value: V,
  ): void => {
    setSettings((currSettings) => ({
      ...currSettings,
      [settingKey]: value,
    }));
  };

  const { patchAppSetting, postAppSetting, appSettingArray } =
    useAppSettingContext();

  useEffect(() => {
    appSettingArray.forEach((s) => {
      if (Object.keys(defaultSettings).includes(s.name)) {
        const settingName = s.name as SettingKey;
        const value =
          s?.data[defaultSettings[settingName].dataKey] ||
          defaultSettings[settingName].defaultValue;

        setSettings((currSettings) => ({
          ...currSettings,
          [settingName]: value,
        }));
      }
    });
  }, [appSettingArray]);

  const saveSettings = (): void => {
    Object.entries(settings).forEach(([key, value]) => {
      const setting = getAppSetting(appSettingArray, key);
      const settingKey = key as SettingKey;
      const { dataKey } = defaultSettings[settingKey];

      if (setting) {
        patchAppSetting({
          data: { [dataKey]: value },
          id: setting.id,
        });
      } else {
        postAppSetting({
          data: { [dataKey]: value },
          name: key,
        });
      }
    });
  };

  const isChanged = Object.entries(settings)
    .map(([key, value]) => {
      const settingKey = key as SettingKey;
      const { dataKey } = defaultSettings[settingKey];
      const appSettingDataValue = getAppSetting(appSettingArray, key)?.data[
        dataKey
      ];

      if (dataKey === 'keywords') {
        const k1 = value as Keyword[];
        const k2 = (appSettingDataValue ?? []) as Keyword[];

        const isKeywordListEqual: boolean =
          k1.length === k2.length &&
          k1.every((e1) =>
            k2.some((e2) => e1.word === e2.word && e1.def === e2.def),
          );
        return !isKeywordListEqual;
      }

      return value !== appSettingDataValue;
    })
    .some((v) => v);

  return (
    <div data-cy={BUILDER_VIEW_CY}>
      <PublicAlert />
      <Typography
        variant="h4"
        sx={{
          color: '#5050d2',
          margin: '25px',
        }}
      >
        Prepare Your Lesson
      </Typography>
      <Alert severity="warning" sx={{ margin: DEFAULT_MARGIN }}>
        Do not forget to save your work with the save button at the bottom of
        this page.
      </Alert>
      <SetText
        textDataCy={TITLE_INPUT_FIELD_CY}
        value={settings[LESSON_TITLE_SETTING_KEY]}
        textFieldLabel="Enter the lesson title"
        onChange={(text) => updateSettingState(LESSON_TITLE_SETTING_KEY, text)}
      />
      <SetText
        textDataCy={TEXT_INPUT_FIELD_CY}
        value={settings[TEXT_RESOURCE_SETTING_KEY]}
        multiline
        minRows={2}
        textFieldLabel="Enter the text students will see"
        onChange={(text) => updateSettingState(TEXT_RESOURCE_SETTING_KEY, text)}
      />
      <Typography
        variant="h5"
        sx={{
          color: '#5050d2',
          marginLeft: '25px',
        }}
      >
        Chatbot settings
      </Typography>
      <Box marginLeft="30px" marginRight="35px">
        <p>
          If enabled, it will be possible to ask questions about the keywords
          directly in the chat. Otherwise, the definitions will be displayed.
        </p>
      </Box>
      <SwitchModes
        value={settings[USE_CHATBOT_SETTING_KEY]}
        onChange={(useChatbot) =>
          updateSettingState(USE_CHATBOT_SETTING_KEY, useChatbot)
        }
      />
      {settings[USE_CHATBOT_SETTING_KEY] && (
        <Box data-cy={CHATBOT_CONTAINER_CY}>
          <SetText
            textDataCy={INITIAL_PROMPT_INPUT_FIELD_CY}
            value={settings[INITIAL_PROMPT_SETTING_KEY]}
            multiline
            textFieldLabel="Enter the intial prompt describing the conversation (as a template for {{keyword}})"
            onChange={(text) =>
              updateSettingState(INITIAL_PROMPT_SETTING_KEY, text)
            }
          />
          <SetText
            textDataCy={INITIAL_CHATBOT_PROMPT_INPUT_FIELD_CY}
            value={settings[INITIAL_CHATBOT_PROMPT_SETTING_KEY]}
            multiline
            textFieldLabel="Enter the chatbot's first line (as a template for {{keyword}})"
            onChange={(text) =>
              updateSettingState(INITIAL_CHATBOT_PROMPT_SETTING_KEY, text)
            }
          />
        </Box>
      )}
      <Typography
        variant="h5"
        sx={{
          color: '#5050d2',
          margin: '25px',
        }}
      >
        Keywords settings
      </Typography>
      <KeyWords
        keywords={settings[KEYWORDS_SETTING_KEY]}
        textStudents={settings[TEXT_RESOURCE_SETTING_KEY]}
        chatbotEnabled={settings[USE_CHATBOT_SETTING_KEY]}
        onChange={(keywords) =>
          updateSettingState(KEYWORDS_SETTING_KEY, keywords)
        }
      />

      <Box
        component="span"
        justifyContent="flex-end"
        display="flex"
        sx={{ margin: DEFAULT_MARGIN }}
      >
        <GraaspButton
          buttonDataCy={SETTINGS_SAVE_BUTTON_CY}
          handleOnClick={saveSettings}
          sx={{ margin: DEFAULT_MARGIN, mr: 0 }}
          minHeight="55px"
          disabled={!isChanged}
          text="Save"
        />
      </Box>
    </div>
  );
};

export default BuilderView;
