import { FC, KeyboardEventHandler, useState } from 'react';

import SendIcon from '@mui/icons-material/Send';
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';

import { useTextAnalysisTranslation } from '@/config/i18n';
import { TEXT_ANALYSIS } from '@/langs/constants';

import { ENTER_KEY } from '../../../config/constants';

type Prop = {
  onSend: (input: string) => void;
};

const InputBar: FC<Prop> = ({ onSend }) => {
  const { t } = useTextAnalysisTranslation();
  const [comment, setComment] = useState('');

  const onChange = ({ target }: { target: { value: string } }): void => {
    setComment(target.value);
  };

  const handleClickSend = (input: string): void => {
    onSend(input);
    setComment('');
  };

  const onEnterPress: KeyboardEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event): void => {
    if (event.key === ENTER_KEY) {
      handleClickSend(comment);
    }
  };

  return (
    <FormControl sx={{ m: 1 }} variant="outlined">
      <InputLabel>{t(TEXT_ANALYSIS.INPUT_BAR_REPLY_HERE)}</InputLabel>
      <OutlinedInput
        value={comment}
        onChange={onChange}
        onKeyDown={onEnterPress}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label={t(TEXT_ANALYSIS.INPUT_BAR_SEND_BTN)}
              onClick={() => handleClickSend(comment)}
              edge="end"
            >
              <SendIcon />
            </IconButton>
          </InputAdornment>
        }
        label={t(TEXT_ANALYSIS.INPUT_BAR_REPLY_HERE)}
      />
    </FormControl>
  );
};

export default InputBar;
