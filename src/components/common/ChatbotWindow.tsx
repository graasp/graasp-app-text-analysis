import { FC } from 'react';

import { Box, Button, Typography } from '@mui/material';

import { keyword } from '../../config/appSettingTypes';
import { DEFAULT_MARGIN, GREY } from '../../config/stylingConstants';

type Prop = { closeChatbot: () => void; focusWord: keyword };
// eslint-disable-next-line arrow-body-style
const ChatbotWindow: FC<Prop> = ({ closeChatbot, focusWord }) => {
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
      <Typography
        margin={DEFAULT_MARGIN}
        marginTop="0px"
        sx={{ flex: 2 }}
      >{`${focusWord.word}: ${focusWord.def}`}</Typography>
    </Box>
  );
};

export default ChatbotWindow;
