import { FC, PropsWithChildren } from 'react';

import { Avatar, Box } from '@mui/material';

import { GRAY } from '../../config/stylingConstants';

type Prop = {
  userName: string;
};

const UserBox: FC<PropsWithChildren<Prop>> = ({ userName, children }) => (
  <Box
    display="flex"
    flexDirection="row-reverse"
    alignItems="center"
    whiteSpace="pre-line"
  >
    <Avatar
      sx={{
        marginRight: '5px',
        backgroundColor: GRAY,
      }}
      alt={userName.toLocaleUpperCase()}
      src="/broken-image.jpg"
    />
    {children}
  </Box>
);

export default UserBox;
