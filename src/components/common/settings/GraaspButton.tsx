import { FC } from 'react';

import { Button, SxProps } from '@mui/material';

import { GRAASP_VIOLET } from '../../../config/stylingConstants';

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
    fullWidth={fullWidth}
    sx={{
      backgroundColor: GRAASP_VIOLET,
      minHeight,
      marginRight,
      ...sx,
    }}
    onClick={handleOnClick}
    disabled={disabled}
  >
    {text}
  </Button>
);

export default GraaspButton;
