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
  showDisable: boolean;
  onHideClick: () => void;
  hideDisable: boolean;
};

const Banner: FC<Prop> = ({
  title,
  onSummonClick,
  showDisable,
  onHideClick,
  hideDisable,
}) => (
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
    <Box display="flex" flex-direction="row-reverse">
      <Button
        variant="contained"
        sx={{ marginRight: DEFAULT_MARGIN }}
        onClick={onHideClick}
        disabled={hideDisable}
      >
        Hide Keywords
      </Button>
      <Button
        data-cy={SUMMON_BUTTON_CY}
        variant="contained"
        color="success"
        sx={{ marginRight: DEFAULT_MARGIN }}
        onClick={onSummonClick}
        disabled={showDisable}
      >
        Show Keywords
      </Button>
    </Box>
  </Box>
);

export default Banner;
