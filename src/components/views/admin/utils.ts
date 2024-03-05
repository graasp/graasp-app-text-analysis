import isequal from 'lodash.isequal';

import { AppSetting } from '@graasp/sdk';

import { getAppSetting } from '@/utils/appSettings';

import { DATA_KEYS, SettingKey, defaultSettings } from './types';

export const hasKeyChanged = ({
  settingKey,
  setting,
  appSettings,
}: {
  settingKey: SettingKey;
  setting: (typeof defaultSettings)[typeof settingKey];
  appSettings: AppSetting[];
}): boolean => {
  const { value, dataKey } = setting;
  const appSettingDataValue = getAppSetting(appSettings, settingKey)?.data[
    dataKey
  ];

  if (dataKey === DATA_KEYS.KEYWORDS) {
    return !isequal(value, appSettingDataValue ?? []);
  }

  // Undefined and empty string should be considered as
  // the same to have save button disabled when no settings.
  return Boolean(value || appSettingDataValue) && value !== appSettingDataValue;
};
