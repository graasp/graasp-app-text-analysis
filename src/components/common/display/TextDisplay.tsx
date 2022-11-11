import { FC } from 'react';

import { Typography } from '@mui/material';

import { TEXT_DISPLAY_FIELD_CY } from '../../../config/selectors';
import { DEFAULT_MARGIN } from '../../../config/stylingConstants';
import Highlighted from './Highlighted';

type Prop = { text: string; highlight: boolean; keywords: string[] };

// eslint-disable-next-line arrow-body-style
const TextDisplay: FC<Prop> = ({ text, highlight, keywords }) => {
  return (
    <div>
      <Typography
        data-cy={TEXT_DISPLAY_FIELD_CY}
        variant="body1"
        sx={{
          margin: DEFAULT_MARGIN,
          border: '2px solid #5050d2',
          borderRadius: '10px',
          padding: '25px',
        }}
      >
        <Highlighted text={text} words={keywords} highlight={highlight} />
      </Typography>
    </div>
  );
};

export default TextDisplay;
