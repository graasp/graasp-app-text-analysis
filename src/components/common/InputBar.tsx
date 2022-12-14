import { FC, KeyboardEventHandler, useState } from 'react';

import SendIcon from '@mui/icons-material/Send';
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';

import { ENTER_KEY } from '../../config/constants';

type Prop = {
  onSend: (input: string) => void;
};

const InputBar: FC<Prop> = ({ onSend }) => {
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
      <InputLabel>reply here ...</InputLabel>
      <OutlinedInput
        value={comment}
        onChange={onChange}
        onKeyDown={onEnterPress}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="send"
              onClick={() => handleClickSend(comment)}
              edge="end"
            >
              <SendIcon />
            </IconButton>
          </InputAdornment>
        }
        label="reply here ..."
      />
    </FormControl>
  );
};

export default InputBar;
