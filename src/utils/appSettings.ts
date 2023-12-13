import { Data } from '@graasp/apps-query-client';
import { AppSetting } from '@graasp/sdk';

export const getAppSetting = (
  appSettings: AppSetting[],
  key: string,
): AppSetting | undefined => appSettings.find((s) => s.name === key);

export const getDataAppSetting = <T extends Data>(
  appSettings: AppSetting[],
  settingKey: string,
  dataSettingKey: keyof T,
  defaultDataSetting: T,
): T => {
  const dataAppSetting = getAppSetting(appSettings, settingKey)?.data as T;

  if (!dataAppSetting || !dataAppSetting[dataSettingKey]) {
    return defaultDataSetting;
  }

  return dataAppSetting;
};
