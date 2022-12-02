import { FC, useEffect, useState } from 'react';

import { FormControlLabel, Switch } from '@mui/material';

import {
  USE_CHATBOT_SETTING_KEY,
  UseChatbotSetting,
} from '../../../config/appSettingTypes';
import { DEFAULT_USE_CHATBOT_SETTING } from '../../../config/appSettings';
import { DEFAULT_MARGIN } from '../../../config/stylingConstants';
import { useAppSettingContext } from '../../context/AppSettingContext';

const SwitchModes: FC = () => {
  const [useChatbot, setUseChatbot] = useState(false);
  const { patchAppSetting, postAppSetting, appSettingArray } =
    useAppSettingContext();

  const useChatbotSetting = appSettingArray.find(
    (s) => s.name === USE_CHATBOT_SETTING_KEY,
  ) as UseChatbotSetting;

  useEffect(() => {
    const { useBot } = useChatbotSetting?.data || DEFAULT_USE_CHATBOT_SETTING;
    setUseChatbot(useBot);
  }, [useChatbotSetting]);

  const handleOnChange = ({
    target,
  }: {
    target: { checked: boolean };
  }): void => {
    const newValue = target.checked;
    if (useChatbotSetting) {
      patchAppSetting({
        data: { useBot: newValue },
        id: useChatbotSetting.id,
      });
    } else {
      postAppSetting({
        data: { useBot: newValue },
        name: USE_CHATBOT_SETTING_KEY,
      });
    }
  };

  return (
    <FormControlLabel
      control={<Switch checked={useChatbot} onChange={handleOnChange} />}
      label="use chatbot"
      sx={{ marginLeft: DEFAULT_MARGIN }}
    />
  );
};

export default SwitchModes;
