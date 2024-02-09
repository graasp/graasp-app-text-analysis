import { AppSetting } from '@graasp/sdk';

import { Keyword } from '@/config/appSettingTypes';
import { getAppSetting } from '@/utils/appSettings';

import { DATA_KEYS, SettingKey, defaultSettings } from './types';

export const getMostRecentTime = (acc: Date | null, val: AppSetting): Date => {
  const date = new Date(val.updatedAt ?? val.createdAt);
  if (!acc) {
    return date;
  }

  return acc > date ? acc : date;
};

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
