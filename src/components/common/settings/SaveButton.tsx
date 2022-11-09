import { FC } from 'react';

import { Button } from '@mui/material';

import { FULL_WIDTH } from '../../../config/stylingConstants';

type Prop = {
  buttonDataCy: string;
  handleOnClick: () => void;
  fullWidth?: boolean;
  marginRight?: string;
  minHeight?: string;
};

const SaveButton: FC<Prop> = ({
  buttonDataCy,
  handleOnClick,
  fullWidth = false,
  marginRight,
  minHeight,
}) => (
  <Button
    data-cy={buttonDataCy}
    variant="contained"
    sx={{
      backgroundColor: '#5050d2',
      minHeight,
      marginRight,
      ...(fullWidth && { width: FULL_WIDTH }),
    }}
    onClick={handleOnClick}
  >
    Save
  </Button>
);

export default SaveButton;
