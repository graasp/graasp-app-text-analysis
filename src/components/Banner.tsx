import { FC } from 'react';

import { Box, Button, Typography } from '@mui/material';

import { BANNER_CY, SUMMON_BUTTON_CY } from '../config/selectors';

type Prop = {
  title: string;
  onSummonClick: () => void;
  buttonDisable: boolean;
};

const bannerBox = {
  height: '70px',
  backgroundColor: '#BABABA',
  padding: '2px',
  minWidth: '600px',
};

const Banner: FC<Prop> = ({ title, onSummonClick, buttonDisable }) => (
  <Box
    data-cy={BANNER_CY}
    component="span"
    justifyContent="space-between"
    display="flex"
    alignItems="center"
    sx={bannerBox}
  >
    <Typography
      variant="h4"
      sx={{
        color: '#5050d2',
        marginLeft: '25px',
      }}
    >
      {title}
    </Typography>
    <Button
      data-cy={SUMMON_BUTTON_CY}
      variant="contained"
      color="success"
      sx={{ marginRight: '25px' }}
      onClick={onSummonClick}
      disabled={buttonDisable}
    >
      Summon
    </Button>
  </Box>
);

export default Banner;
