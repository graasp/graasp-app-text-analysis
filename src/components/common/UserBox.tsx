import { FC, PropsWithChildren } from 'react';

import { Avatar, Box } from '@mui/material';

import { GRAY } from '../../config/stylingConstants';

type Prop = {
  key: string;
  userName: string;
};

const UserBox: FC<PropsWithChildren<Prop>> = ({ key, userName, children }) => (
  <Box key={key} display="flex" flexDirection="row-reverse" alignItems="center">
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
