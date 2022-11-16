import { FC } from 'react';

import { Box, Button, Typography } from '@mui/material';

import { BANNER_CY, SUMMON_BUTTON_CY } from '../../../config/selectors';
import {
  DEFAULT_MARGIN,
  GRAASP_VIOLET,
} from '../../../config/stylingConstants';

type Prop = {
  title: string;
  onSummonClick: () => void;
  buttonDisable: boolean;
};

const Banner: FC<Prop> = ({ title, onSummonClick, buttonDisable }) => (
  <Box
    data-cy={BANNER_CY}
    component="span"
    justifyContent="space-between"
    display="flex"
    alignItems="center"
    sx={{ minHeight: '70px' }}
  >
    <Typography
      variant="h4"
      sx={{
        color: GRAASP_VIOLET,
        marginLeft: DEFAULT_MARGIN,
      }}
    >
      {title}
    </Typography>
    <Button
      data-cy={SUMMON_BUTTON_CY}
      variant="contained"
      color="success"
      sx={{ marginRight: DEFAULT_MARGIN }}
      onClick={onSummonClick}
      disabled={buttonDisable}
    >
      Show Keywords
    </Button>
  </Box>
);

export default Banner;
