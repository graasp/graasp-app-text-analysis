import { FC } from 'react';

import { Box, Button } from '@mui/material';

import { DEFAULT_MARGIN, GREY } from '../../config/stylingConstants';

type Prop = { closeChatbot: () => void };
// eslint-disable-next-line arrow-body-style
const ChatbotWindow: FC<Prop> = ({ closeChatbot }) => {
  return (
    <Box
      sx={{
        alignSelf: 'stretch',
        border: `2px solid ${GREY}`,
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
    </Box>
  );
};

export default ChatbotWindow;
