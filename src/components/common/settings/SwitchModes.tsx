import { FC, useEffect, useState } from 'react';

import { FormControlLabel, Switch } from '@mui/material';

import {
  USE_CHATBOT_SETTING_KEY,
  UseChatbotSetting,
} from '../../../config/appSettingTypes';
import { DEFAULT_USE_CHATBOT_SETTING } from '../../../config/appSettings';
import { USE_CHATBOT_DATA_CY } from '../../../config/selectors';
import { DEFAULT_MARGIN } from '../../../config/stylingConstants';
import { useAppSettingContext } from '../../context/AppSettingContext';

type Prop = {
  onChange?: (useChatbot: boolean) => void;
};

const SwitchModes: FC<Prop> = ({ onChange }) => {
  const [useChatbot, setUseChatbot] = useState(false);
  const { patchAppSetting, postAppSetting, appSettingArray } =
    useAppSettingContext();

  const useChatbotSetting = appSettingArray.find(
    (s) => s.name === USE_CHATBOT_SETTING_KEY,
  ) as UseChatbotSetting;

  useEffect(() => {
    const { useBot } = useChatbotSetting?.data || DEFAULT_USE_CHATBOT_SETTING;
    setUseChatbot(useBot);

    if (onChange) {
      onChange(useBot);
    }
  }, [onChange, useChatbotSetting]);

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
      control={
        <Switch
          data-cy={USE_CHATBOT_DATA_CY}
          checked={useChatbot}
          onChange={handleOnChange}
        />
      }
      label="enable the chatbot"
      sx={{ marginLeft: DEFAULT_MARGIN }}
    />
  );
};

export default SwitchModes;
