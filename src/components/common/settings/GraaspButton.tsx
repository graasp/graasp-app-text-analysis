import { FC } from 'react';

import { Button, SxProps } from '@mui/material';

import { FULL_WIDTH, GRAASP_VIOLET } from '../../../config/stylingConstants';

type Prop = {
  buttonDataCy: string;
  handleOnClick: () => void;
  disabled: boolean;
  fullWidth?: boolean;
  marginRight?: string;
  minHeight?: string;
  text: string;
  sx?: SxProps;
};

const GraaspButton: FC<Prop> = ({
  buttonDataCy,
  handleOnClick,
  disabled,
  fullWidth = false,
  marginRight,
  minHeight,
  text,
  sx,
}) => (
  <Button
    data-cy={buttonDataCy}
    variant="contained"
    sx={{
      backgroundColor: GRAASP_VIOLET,
      minHeight,
      marginRight,
      ...(fullWidth && { width: FULL_WIDTH }),
      ...sx,
    }}
    onClick={handleOnClick}
    disabled={disabled}
  >
    {text}
  </Button>
);

export default GraaspButton;
