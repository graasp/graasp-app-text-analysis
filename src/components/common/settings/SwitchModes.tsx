import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { FormControlLabel, Switch } from '@mui/material';

import { TEXT_ANALYSIS } from '@/langs/constants';

import { USE_CHATBOT_DATA_CY } from '../../../config/selectors';

type Prop = {
  value: boolean;
  onChange: (useChatbot: boolean) => void;
};

const SwitchModes: FC<Prop> = ({ value, onChange }) => {
  const { t } = useTranslation();
  const handleOnChange = ({ target }: { target: { checked: boolean } }): void =>
    onChange(target.checked);

  return (
    <FormControlLabel
      sx={{ maxWidth: 'max-content' }}
      control={
        <Switch
          data-cy={USE_CHATBOT_DATA_CY}
          checked={value}
          onChange={handleOnChange}
        />
      }
      label={t(TEXT_ANALYSIS.ENABLE_CHATBOT_TOGGLE)}
    />
  );
};

export default SwitchModes;
