import { FC, ReactElement, useEffect, useRef } from 'react';

import { Box, Button, Typography } from '@mui/material';

import { keyword } from '../../config/appSettingTypes';
import { SCROLL_SAFETY_MARGIN } from '../../config/constants';
import { DEFAULT_MARGIN, GRAY } from '../../config/stylingConstants';
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

  const ref = useRef<HTMLDivElement>(null);

  // scroll down to last message at start, on new message and on editing message
  useEffect(() => {
    if (ref?.current) {
      // temporarily hide the scroll bars when scrolling the container
      ref.current.style.overflowY = 'hidden';
      // scroll down the height of the container + some margin to make sure we are at the bottom
      ref.current.scrollTop = ref.current.scrollHeight + SCROLL_SAFETY_MARGIN;
      // re-activate scroll
      ref.current.style.overflowY = 'auto';
    }
  }, [ref, isOpen]);

  return (
    <Box
      ref={ref}
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
