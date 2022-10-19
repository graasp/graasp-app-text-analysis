import { FC } from 'react';

import { Typography } from '@mui/material';

type Prop = { text: string };

// eslint-disable-next-line arrow-body-style
const TextDisplay: FC<Prop> = ({ text }) => {
  return (
    <div>
      <Typography
        variant="body1"
        sx={{ margin: '2px', border: '1px blue solid' }}
      >
        {text}
      </Typography>
    </div>
  );
};

export default TextDisplay;
