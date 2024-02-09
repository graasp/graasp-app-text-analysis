import debounce from 'lodash.debounce';

import { FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Alert, Box, Button, Stack, Typography } from '@mui/material';

import {
  CreateCommand,
  HistoryManager,
  UpdateCommand,
} from '@/commands/commands';
import GraaspButton from '@/components/common/settings/GraaspButton';
import { TEXT_ANALYSIS } from '@/langs/constants';

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
import {
  DEFAULT_IN_SECTION_SPACING,
  DEFAULT_MARGIN,
  DEFAULT_SECTION_SPACING,
} from '../../../config/stylingConstants';
import { getAppSetting } from '../../../utils/appSettings';
import PublicAlert from '../../common/PublicAlert';
import KeyWords from '../../common/settings/KeyWords';
import SetText from '../../common/settings/SetText';
import SwitchModes from '../../common/settings/SwitchModes';
import { useAppSettingContext } from '../../context/AppSettingContext';

const DATA_KEYS = {
  TEXT: 'text',
  USE_BOT: 'useBot',
  KEYWORDS: 'keywords',
} as const;

const defaultSettings = {
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
type SettingKey = keyof typeof defaultSettings;
type SettingValue = (typeof defaultSettings)[SettingKey]['value'];

const settingKeys = Object.keys(defaultSettings).map((k) => k as SettingKey);

const BuilderView: FC = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState(defaultSettings);

  // This state is used to avoid to erase changes if another setting is saved.
  const [isClean, setIsClean] = useState(true);

  interface DebouncedFunction {
    (): void;
    cancel(): void;
  }
  const debounceMap = useRef(new Map<string, DebouncedFunction>());
  const DEBOUNCE_MS = 700;

  const { appSettingArray, settingContext } = useAppSettingContext();
  const history = new HistoryManager();

  const hasKeyChanged = ({
    settingKey,
    setting,
  }: {
    settingKey: SettingKey;
    setting: (typeof settings)[typeof settingKey];
  }): boolean => {
    const { value, dataKey } = setting;
    const appSettingDataValue = getAppSetting(appSettingArray, settingKey)
      ?.data[dataKey];

    if (dataKey === DATA_KEYS.KEYWORDS) {
      const k1 = value;
      const k2 = (appSettingDataValue ?? []) as Keyword[];

      const isKeywordListEqual: boolean =
        k1.length === k2.length &&
        k1.every((e1) =>
          k2.some((e2) => e1.word === e2.word && e1.def === e2.def),
        );
      return !isKeywordListEqual;
    }

    return value !== appSettingDataValue;
  };

  const saveSetting = ({
    settingKey,
    setting,
  }: {
    settingKey: SettingKey;
    setting: (typeof settings)[typeof settingKey];
  }): void => {
    const appSetting = getAppSetting(appSettingArray, settingKey);
    const { value, dataKey } = setting;

    if (appSetting) {
      if (!hasKeyChanged({ settingKey, setting })) {
        return;
      }

      history.execute(
        new UpdateCommand({
          apiContext: settingContext,
          currState: {
            data: { [dataKey]: value },
            id: appSetting.id,
          },
          prevState: {
            data: { [dataKey]: appSetting.data },
            id: appSetting.id,
          },
        }),
      );
    } else {
      history.execute(
        new CreateCommand({
          apiContext: settingContext,
          currState: {
            data: { [dataKey]: value },
            name: settingKey,
          },
        }),
      );
    }
  };

  const updateSettingState = <K extends SettingKey, V extends SettingValue>(
    settingKey: K,
    value: V,
    stateIsClean = false,
  ): void => {
    setSettings((currSettings) => ({
      ...currSettings,
      [settingKey]: {
        ...currSettings[settingKey],
        value,
      },
    }));

    setIsClean(stateIsClean);

    debounceMap.current.get(settingKey)?.cancel();
    const newDebounce = debounce(() => {
      const setting = settings[settingKey];
      setting.value = value;
      saveSetting({ settingKey, setting });
    }, DEBOUNCE_MS);
    debounceMap.current.set(settingKey, newDebounce);
    newDebounce();
  };

  useEffect(() => {
    if (isClean) {
      appSettingArray.forEach((s) => {
        if (settingKeys.find((k) => k === s.name)) {
          const settingName = s.name as SettingKey;
          const { dataKey, value: defaultValue } = defaultSettings[settingName];
          const appDataValue = s?.data[dataKey] as SettingValue;

          updateSettingState(settingName, appDataValue || defaultValue, true);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appSettingArray, isClean]);

  const saveSettings = (): void => {
    settingKeys.forEach((settingKey) =>
      saveSetting({ settingKey, setting: settings[settingKey] }),
    );
    setIsClean(true);
  };

  const isChanged = settingKeys
    .map((settingKey) =>
      hasKeyChanged({
        settingKey,
        setting: settings[settingKey],
      }),
    )
    .some((v) => v);

  return (
    <Stack
      data-cy={BUILDER_VIEW_CY}
      spacing={DEFAULT_SECTION_SPACING}
      pl={DEFAULT_MARGIN}
      pr={DEFAULT_MARGIN}
    >
      <PublicAlert />
      <Typography variant="h4" sx={{ color: '#5050d2' }}>
        {t(TEXT_ANALYSIS.BUILDER_VIEW_TITLE)}
      </Typography>
      {isChanged && (
        <Alert
          severity="warning"
          action={
            <Button size="small" variant="contained" onClick={saveSettings}>
              {t(TEXT_ANALYSIS.BUILDER_NOT_SAVE_ALERT_SAVE_BTN)}
            </Button>
          }
        >
          {t(TEXT_ANALYSIS.BUILDER_NOT_SAVE_ALERT_MSG)}
        </Alert>
      )}
      <Stack spacing={DEFAULT_IN_SECTION_SPACING}>
        <SetText
          textDataCy={TITLE_INPUT_FIELD_CY}
          value={settings[LESSON_TITLE_SETTING_KEY].value}
          textFieldLabel={t(TEXT_ANALYSIS.BUILDER_TEXTFIELD_LESSON_TITLE)}
          onChange={(text) =>
            updateSettingState(LESSON_TITLE_SETTING_KEY, text)
          }
        />
        <SetText
          textDataCy={TEXT_INPUT_FIELD_CY}
          value={settings[TEXT_RESOURCE_SETTING_KEY].value}
          multiline
          minRows={2}
          textFieldLabel={t(TEXT_ANALYSIS.BUILDER_TEXTFIELD_TEXT_STUDENT)}
          onChange={(text) =>
            updateSettingState(TEXT_RESOURCE_SETTING_KEY, text)
          }
        />
      </Stack>

      <Stack spacing={1}>
        <Typography variant="h5" sx={{ color: '#5050d2' }}>
          {t(TEXT_ANALYSIS.BUILDER_CHATBOT_SETTING_TITLE)}
        </Typography>
        <Typography>{t(TEXT_ANALYSIS.BUILDER_CHATBOT_SETTING_INFO)}</Typography>
        <SwitchModes
          value={settings[USE_CHATBOT_SETTING_KEY].value}
          onChange={(useChatbot) =>
            updateSettingState(USE_CHATBOT_SETTING_KEY, useChatbot)
          }
        />
        {settings[USE_CHATBOT_SETTING_KEY].value && (
          <Stack
            data-cy={CHATBOT_CONTAINER_CY}
            spacing={DEFAULT_IN_SECTION_SPACING}
          >
            <SetText
              textDataCy={INITIAL_PROMPT_INPUT_FIELD_CY}
              value={settings[INITIAL_PROMPT_SETTING_KEY].value}
              multiline
              textFieldLabel="Enter the intial prompt describing the conversation (as a template for {{keyword}})"
              onChange={(text) =>
                updateSettingState(INITIAL_PROMPT_SETTING_KEY, text)
              }
            />
            <SetText
              textDataCy={INITIAL_CHATBOT_PROMPT_INPUT_FIELD_CY}
              value={settings[INITIAL_CHATBOT_PROMPT_SETTING_KEY].value}
              multiline
              textFieldLabel="Enter the chatbot's first line (as a template for {{keyword}})"
              onChange={(text) =>
                updateSettingState(INITIAL_CHATBOT_PROMPT_SETTING_KEY, text)
              }
            />
          </Stack>
        )}
      </Stack>
      <Stack spacing={DEFAULT_IN_SECTION_SPACING}>
        <Typography variant="h5" sx={{ color: '#5050d2' }}>
          {t(TEXT_ANALYSIS.BUILDER_KEYWORDS_SETTING_TITLE)}
        </Typography>
        <KeyWords
          keywords={settings[KEYWORDS_SETTING_KEY].value}
          textStudents={settings[TEXT_RESOURCE_SETTING_KEY].value}
          chatbotEnabled={settings[USE_CHATBOT_SETTING_KEY].value}
          onChange={(keywords) =>
            updateSettingState(KEYWORDS_SETTING_KEY, keywords)
          }
        />
      </Stack>

      <Box justifyContent="flex-end" display="flex">
        <GraaspButton
          buttonDataCy={SETTINGS_SAVE_BUTTON_CY}
          handleOnClick={saveSettings}
          minHeight="55px"
          disabled={!isChanged}
          text={t(TEXT_ANALYSIS.BUILDER_SAVE_BTN)}
        />
      </Box>
    </Stack>
  );
};

export default BuilderView;
