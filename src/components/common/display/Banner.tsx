import { FC, useState } from 'react';

import { Box, Button, Typography } from '@mui/material';

import { BANNER_CY, SHOW_KEYWORDS_BUTTON_CY } from '../../../config/selectors';
import {
  DEFAULT_MARGIN,
  GRAASP_VIOLET,
} from '../../../config/stylingConstants';

type Prop = {
  title: string;
  disabled: boolean;
  onClick: (showKeywords: boolean) => void;
};

const Banner: FC<Prop> = ({ title, disabled, onClick }) => {
  const [showKeywords, setShowKeywords] = useState(false);

  // TODO: translate me
  const SHOW_KEYWORDS_LABEL = 'show keywords';
  const HIDE_KEYWORDS_LABEL = 'hide keywords';

  const toggleKeywords = (): void => {
    onClick(!showKeywords);
    setShowKeywords(!showKeywords);
  };

  return (
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
          data-cy={SHOW_KEYWORDS_BUTTON_CY}
          variant={showKeywords ? 'outlined' : 'contained'}
          sx={{ marginRight: DEFAULT_MARGIN }}
          onClick={toggleKeywords}
          disabled={disabled}
        >
          {showKeywords ? HIDE_KEYWORDS_LABEL : SHOW_KEYWORDS_LABEL}
        </Button>
      </Box>
    </Box>
  );
};

export default Banner;
