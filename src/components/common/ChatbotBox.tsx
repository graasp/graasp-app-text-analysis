import { FC, PropsWithChildren } from 'react';

import SmartToyIcon from '@mui/icons-material/SmartToy';
import { Box } from '@mui/material';

import { GRAASP_VIOLET } from '../../config/stylingConstants';

type Prop = {
  key: string;
};

const ChatbotBox: FC<PropsWithChildren<Prop>> = ({ key, children }) => (
  <Box key={key} display="flex" flexDirection="row" alignItems="center">
    <SmartToyIcon
      sx={{
        marginLeft: '5px',
        color: GRAASP_VIOLET,
        fontSize: 40,
      }}
    />
    {children}
  </Box>
);

export default ChatbotBox;
