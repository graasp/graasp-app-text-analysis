import { FC } from 'react';

import { Box, Button } from '@mui/material';

// eslint-disable-next-line arrow-body-style
const ChatbotWindow: FC = () => {
  return (
    <Box
      sx={{
        minHeight: '200px',
        border: '2px solid #BABABA',
        borderRadius: '10px',
        margin: '25px',
        marginLeft: '0px',
        width: '550px',
        minWidth: '175px',
      }}
    >
      <Box display="flex" justifyContent="flex-end" alignItems="flex-start">
        <Button
          sx={{
            width: '25px',
            minWidth: '25px',
            height: '25px',
          }}
        >
          X
        </Button>
      </Box>
      Chatbot Window
    </Box>
  );
};

export default ChatbotWindow;
