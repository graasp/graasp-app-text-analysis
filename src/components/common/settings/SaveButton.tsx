import { FC } from 'react';

import { Button } from '@mui/material';

import { FULL_WIDTH, GRAASP_VIOLET } from '../../../config/stylingConstants';

type Prop = {
  buttonDataCy: string;
  handleOnClick: () => void;
  disabled: boolean;
  fullWidth?: boolean;
  marginRight?: string;
  minHeight?: string;
};

const SaveButton: FC<Prop> = ({
  buttonDataCy,
  handleOnClick,
  disabled,
  fullWidth = false,
  marginRight,
  minHeight,
}) => (
  <Button
    data-cy={buttonDataCy}
    variant="contained"
    sx={{
      backgroundColor: GRAASP_VIOLET,
      minHeight,
      marginRight,
      ...(fullWidth && { width: FULL_WIDTH }),
    }}
    onClick={handleOnClick}
    disabled={disabled}
  >
    Save
  </Button>
);

export default SaveButton;
