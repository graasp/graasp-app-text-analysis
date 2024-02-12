import debounce from 'lodash.debounce';

import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useLocalContext } from '@graasp/apps-query-client';
import { formatDate } from '@graasp/sdk';

import { Alert, Box, Button, Stack, Typography } from '@mui/material';

import GraaspButton from '@/components/common/settings/GraaspButton';
import { useOnlineStatus } from '@/components/hooks/useOnlineStatus';
import { DEFAULT_LANG } from '@/config/i18n';
import { TEXT_ANALYSIS } from '@/langs/constants';

import {
  INITIAL_CHATBOT_PROMPT_SETTING_KEY,
  INITIAL_PROMPT_SETTING_KEY,
  KEYWORDS_SETTING_KEY,
  LESSON_TITLE_SETTING_KEY,
  TEXT_RESOURCE_SETTING_KEY,
  USE_CHATBOT_SETTING_KEY,
} from '../../../config/appSettingTypes';
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
import SyncIcon from './SyncIcon';
import {
  DebouncedFunction,
  SettingKey,
  SettingValue,
  defaultSettings,
  settingKeys,
} from './types';
import { getMostRecentTime, hasKeyChanged } from './utils';

const AUTO_SAVE_DEBOUNCE_MS = 700;

const BuilderView: FC = () => {
  const { t } = useTranslation();
  const { lang } = useLocalContext();
  const {
    appSettingArray,
    isError,
    isLoading,
    isSuccess,
    patchAppSetting,
    postAppSetting,
  } = useAppSettingContext();
  const isOnline = useOnlineStatus();

  // This map is used to manage the auto save of each setting.
  const debounceMap = useRef(new Map<string, DebouncedFunction>());
  // This state is used to avoid to erase changes if another setting is saved.
  const [isClean, setIsClean] = useState(true);
  const [settings, setSettings] = useState(defaultSettings);
  const updateSettingState = <K extends SettingKey, V extends SettingValue>(
    settingKey: K,
    value: V,
  ): void =>
    setSettings((currSettings) => ({
      ...currSettings,
      [settingKey]: {
        ...currSettings[settingKey],
        value,
      },
    }));

  const lastSavedTime = useRef<Date>();
  const [lastSavedMsg, setLastSavedMsg] = useState<string>();

  const mostRecentTime = appSettingArray.reduce<Date | null>(
    getMostRecentTime,
    null,
  );

  // use memo otherwise to avoid multiple calls between the interval
  useMemo(
    () =>
      setInterval(() => {
        const lastTime = lastSavedTime.current;

        if (lastTime) {
          setLastSavedMsg(
            formatDate(lastSavedTime.current?.toString(), {
              locale: lang ?? DEFAULT_LANG,
            }),
          );
        }
      }, 20_000),
    [lang],
  );

  const isChanged = settingKeys
    .map((settingKey) =>
      hasKeyChanged({
        settingKey,
        setting: settings[settingKey],
        appSettings: appSettingArray,
      }),
    )
    .some((v) => v);

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
      if (
        !hasKeyChanged({ settingKey, setting, appSettings: appSettingArray })
      ) {
        return;
      }

      patchAppSetting({
        data: { [dataKey]: value },
        id: appSetting.id,
      });
    } else {
      postAppSetting({
        data: { [dataKey]: value },
        name: settingKey,
      });
    }

    if (!isError) {
      lastSavedTime.current = new Date();
    }
  };

  const handleDebounce = <K extends SettingKey, V extends SettingValue>(
    settingKey: K,
    value: V,
  ): void => {
    debounceMap.current.get(settingKey)?.cancel();
    const newDebounce = debounce(() => {
      const setting = settings[settingKey];
      setting.value = value;
      saveSetting({ settingKey, setting });
    }, AUTO_SAVE_DEBOUNCE_MS);
    debounceMap.current.set(settingKey, newDebounce);
    newDebounce();
  };

  const handleSettingChanged = <K extends SettingKey, V extends SettingValue>(
    settingKey: K,
    value: V,
    stateIsClean = false,
  ): void => {
    updateSettingState(settingKey, value);

    setIsClean(stateIsClean);
    handleDebounce(settingKey, value);
  };

  useEffect(() => {
    if (isClean) {
      appSettingArray.forEach((s) => {
        if (settingKeys.find((k) => k === s.name)) {
          const settingName = s.name as SettingKey;
          const { dataKey, value: defaultValue } = defaultSettings[settingName];
          const appDataValue = s?.data[dataKey] as SettingValue;

          handleSettingChanged(settingName, appDataValue || defaultValue, true);
        }
      });
    }

    if (lastSavedTime.current && mostRecentTime) {
      setLastSavedMsg(
        formatDate(mostRecentTime.toString(), {
          locale: lang ?? DEFAULT_LANG,
        }),
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appSettingArray, isClean]);

  const saveSettings = (): void => {
    settingKeys.forEach((settingKey) =>
      saveSetting({ settingKey, setting: settings[settingKey] }),
    );
    setIsClean(!isError);
  };

  return (
    <Stack
      data-cy={BUILDER_VIEW_CY}
      spacing={DEFAULT_SECTION_SPACING}
      pl={DEFAULT_MARGIN}
      pr={DEFAULT_MARGIN}
    >
      <PublicAlert />
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography variant="h4" sx={{ color: '#5050d2' }}>
          {t(TEXT_ANALYSIS.BUILDER_VIEW_TITLE)}
        </Typography>
        <SyncIcon
          isSuccess={isSuccess}
          isLoading={isLoading}
          isError={isError}
          lastSavedMsg={lastSavedMsg}
        />
      </Stack>
      {!isOnline && (
        <Alert severity="warning">
          {t(TEXT_ANALYSIS.BUILDER_OFFLINE_ALERT_MSG)}
        </Alert>
      )}
      {isError && (
        <Alert
          severity="error"
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
            handleSettingChanged(LESSON_TITLE_SETTING_KEY, text)
          }
        />
        <SetText
          textDataCy={TEXT_INPUT_FIELD_CY}
          value={settings[TEXT_RESOURCE_SETTING_KEY].value}
          multiline
          minRows={2}
          textFieldLabel={t(TEXT_ANALYSIS.BUILDER_TEXTFIELD_TEXT_STUDENT)}
          onChange={(text) =>
            handleSettingChanged(TEXT_RESOURCE_SETTING_KEY, text)
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
            handleSettingChanged(USE_CHATBOT_SETTING_KEY, useChatbot)
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
                handleSettingChanged(INITIAL_PROMPT_SETTING_KEY, text)
              }
            />
            <SetText
              textDataCy={INITIAL_CHATBOT_PROMPT_INPUT_FIELD_CY}
              value={settings[INITIAL_CHATBOT_PROMPT_SETTING_KEY].value}
              multiline
              textFieldLabel="Enter the chatbot's first line (as a template for {{keyword}})"
              onChange={(text) =>
                handleSettingChanged(INITIAL_CHATBOT_PROMPT_SETTING_KEY, text)
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
            handleSettingChanged(KEYWORDS_SETTING_KEY, keywords)
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
