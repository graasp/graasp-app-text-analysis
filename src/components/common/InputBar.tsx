import { FC, KeyboardEventHandler, useState } from 'react';

import SendIcon from '@mui/icons-material/Send';
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';

import { APP_DATA_TYPES } from '../../config/appDataTypes';
import { ENTER_KEY } from '../../config/constants';
import { useAppDataContext } from '../context/AppDataContext';

type Prop = {
  onSend: () => void;
  focusWord: string;
};

const InputBar: FC<Prop> = ({ onSend, focusWord }) => {
  const [comment, setComment] = useState('');

  const { postAppDataAsync } = useAppDataContext();

  const onChange = ({ target }: { target: { value: string } }): void => {
    setComment(target.value);
  };

  const handleClickSend = (): void => {
    if (comment.trim() !== '') {
      postAppDataAsync({
        data: { message: comment, keyword: focusWord },
        type: APP_DATA_TYPES.STUDENT_COMMENT,
      })?.then(() => onSend());
      setComment('');
    }
  };

  const onEnterPress: KeyboardEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event): void => {
    if (event.key === ENTER_KEY) {
      handleClickSend();
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
            <IconButton aria-label="send" onClick={handleClickSend} edge="end">
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
