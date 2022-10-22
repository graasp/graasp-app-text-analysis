import { FC } from 'react';

import {
  LESSON_TITLE_KEY,
  TEXT_RESOURCE_KEY,
} from '../../../config/appSettingTypes';
import {
  DEFAULT_LESSON_TITLE,
  DEFAULT_TEXT_RESOURCE_SETTING,
} from '../../../config/appSettings';
import TextDisplay from '../../TextDisplay';
import { useAppSettingContext } from '../../context/AppSettingContext';

type textSetting = { text: string };

// eslint-disable-next-line arrow-body-style
const PlayerView: FC = () => {
  const { appSettingArray } = useAppSettingContext();

  const fetchSetting = (
    key: string,
    defaultSetting: textSetting,
  ): textSetting => {
    const setting = (appSettingArray.find((s) => s.name === key)?.data ||
      defaultSetting) as textSetting;
    return setting;
  };

  return (
    <TextDisplay
      text={fetchSetting(TEXT_RESOURCE_KEY, DEFAULT_TEXT_RESOURCE_SETTING).text}
      title={fetchSetting(LESSON_TITLE_KEY, DEFAULT_LESSON_TITLE).text}
    />
  );
};

export default PlayerView;
