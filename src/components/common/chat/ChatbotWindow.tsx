import { FC } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Typography } from '@mui/material';

import { keyword } from '../../../config/appSettingTypes';
import { CHAT_WINDOW_CY, DICTIONNARY_MODE_CY } from '../../../config/selectors';
import {
  DEFAULT_BORDER_RADIUS,
  DEFAULT_MARGIN,
  GRAASP_VIOLET,
  GRAY,
} from '../../../config/stylingConstants';
import ChatBox from './ChatBox';

type Prop = {
  closeChatbot: () => void;
  focusWord: keyword;
  useChatbot: boolean;
  isOpen: boolean;
};

const ChatbotWindow: FC<Prop> = ({
  closeChatbot,
  focusWord,
  useChatbot,
  isOpen,
}) => {
  const renderWindow = useChatbot ? (
    <ChatBox focusWord={focusWord.word} isOpen={isOpen} />
  ) : (
    <Typography
      data-cy={DICTIONNARY_MODE_CY}
      margin={DEFAULT_MARGIN}
      marginTop="0px"
      sx={{ flex: 2 }}
    >
      {`${focusWord.word}: ${focusWord.def}`}
    </Typography>
  );

  return (
    <Box
      data-cy={CHAT_WINDOW_CY}
      sx={{
        border: `2px solid ${GRAY}`,
        borderRadius: DEFAULT_BORDER_RADIUS,
        margin: DEFAULT_MARGIN,
        marginLeft: '0px',
        flex: 1,
      }}
    >
      <Box display="flex" justifyContent="flex-end" alignItems="flex-start">
        <IconButton
          size="small"
          sx={{ color: GRAASP_VIOLET }}
          onClick={closeChatbot}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      {renderWindow}
    </Box>
  );
};

export default ChatbotWindow;
