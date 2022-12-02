import { FC, ReactElement } from 'react';

import { Box, Button, Typography } from '@mui/material';

import { keyword } from '../../config/appSettingTypes';
import { DEFAULT_MARGIN, GRAY } from '../../config/stylingConstants';
import ChatBox from './ChatBox';

type Prop = {
  closeChatbot: () => void;
  focusWord: keyword;
  useChatbot: boolean;
};

const ChatbotWindow: FC<Prop> = ({ closeChatbot, focusWord, useChatbot }) => {
  const renderContent = (): ReactElement => {
    if (useChatbot) {
      return <ChatBox focusWord={focusWord.word} />;
    }
    return (
      <Typography margin={DEFAULT_MARGIN} marginTop="0px" sx={{ flex: 2 }}>
        {`${focusWord.word}: ${focusWord.def}`}
      </Typography>
    );
  };

  return (
    <Box
      sx={{
        alignSelf: 'stretch',
        border: `2px solid ${GRAY}`,
        borderRadius: '10px',
        margin: DEFAULT_MARGIN,
        marginLeft: '0px',
        flex: 1,
      }}
    >
      <Box display="flex" justifyContent="flex-end" alignItems="flex-start">
        <Button
          sx={{
            width: '25px',
            minWidth: '25px',
            height: '25px',
          }}
          onClick={closeChatbot}
        >
          X
        </Button>
      </Box>
      {renderContent()}
    </Box>
  );
};

export default ChatbotWindow;
