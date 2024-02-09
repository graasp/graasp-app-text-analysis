import { FC } from 'react';

import { Box, TextField } from '@mui/material';

import { DEFAULT_MARGIN, FULL_WIDTH } from '../../../config/stylingConstants';

type Prop = {
  value: string;
  textFieldLabel: string;
  textDataCy: string;

  multiline?: boolean;
  minRows?: number;
  onChange: (text: string) => void;
};

const SetText: FC<Prop> = ({
  value,
  textFieldLabel,
  textDataCy,
  multiline = false,
  minRows = 1,
  onChange,
}) => {
  const handleChange = ({ target }: { target: { value: string } }): void =>
    onChange(target.value);

  return (
    <Box
      component="span"
      justifyContent="space-around"
      display="flex"
      alignItems="flex-end"
      sx={{ margin: DEFAULT_MARGIN }}
    >
      <TextField
        data-cy={textDataCy}
        multiline={multiline}
        label={textFieldLabel}
        variant="outlined"
        onChange={handleChange}
        sx={{ width: FULL_WIDTH }}
        value={value}
        minRows={minRows}
      />
    </Box>
  );
};

export default SetText;
