import { FC, PropsWithChildren } from 'react';

import { Avatar, Box } from '@mui/material';

import { GRAY, ICON_MARGIN } from '../../../config/stylingConstants';

type Prop = {
  initial: string;
};

const UserBox: FC<PropsWithChildren<Prop>> = ({ initial, children }) => (
  <Box
    display="flex"
    flexDirection="row-reverse"
    alignItems="center"
    whiteSpace="pre-line"
  >
    <Avatar
      sx={{
        marginRight: ICON_MARGIN,
        backgroundColor: GRAY,
      }}
    >
      {initial}
    </Avatar>
    {children}
  </Box>
);

export default UserBox;
