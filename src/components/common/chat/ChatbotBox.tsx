import { FC, PropsWithChildren } from 'react';

import SmartToyIcon from '@mui/icons-material/SmartToy';
import { Box } from '@mui/material';

import { GRAASP_VIOLET, ICON_MARGIN } from '../../../config/stylingConstants';

const ChatbotBox: FC<PropsWithChildren> = ({ children }) => (
  <Box
    display="flex"
    flexDirection="row"
    alignItems="center"
    whiteSpace="pre-line"
  >
    <SmartToyIcon
      sx={{
        marginLeft: ICON_MARGIN,
        color: GRAASP_VIOLET,
        fontSize: 40,
      }}
    />
    {children}
  </Box>
);

export default ChatbotBox;
