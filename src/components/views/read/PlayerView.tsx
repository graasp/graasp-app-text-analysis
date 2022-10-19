import { FC } from 'react';

import { TEXT_RESOURCE_KEY } from '../../../config/appSettingTypes';
import { DEFAULT_TEXT_RESOURCE_SETTING } from '../../../config/appSettings';
import TextDisplay from '../../TextDisplay';
import { useAppSettingContext } from '../../context/AppSettingContext';

// eslint-disable-next-line arrow-body-style
const PlayerView: FC = () => {
  const { appSettingArray } = useAppSettingContext();
  const textSetting = (appSettingArray.find(
    (setting) => setting.name === TEXT_RESOURCE_KEY,
  )?.data || DEFAULT_TEXT_RESOURCE_SETTING) as { text: string };

  return <TextDisplay text={textSetting.text} />;
};

export default PlayerView;
