import { FC } from 'react';

import { FormControlLabel, Switch } from '@mui/material';

import { USE_CHATBOT_DATA_CY } from '../../../config/selectors';
import { DEFAULT_MARGIN } from '../../../config/stylingConstants';

type Prop = {
  value: boolean;
  onChange?: (useChatbot: boolean) => void;
};

const SwitchModes: FC<Prop> = ({ value, onChange }) => {
  const handleOnChange = ({
    target,
  }: {
    target: { checked: boolean };
  }): void => {
    if (onChange) {
      onChange(target.checked);
    }
  };

  return (
    <FormControlLabel
      control={
        <Switch
          data-cy={USE_CHATBOT_DATA_CY}
          checked={value}
          onChange={handleOnChange}
        />
      }
      label="enable the chatbot"
      sx={{ marginLeft: DEFAULT_MARGIN }}
    />
  );
};

export default SwitchModes;
