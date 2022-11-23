import { FC } from 'react';

import { Typography } from '@mui/material';

import { TEXT_DISPLAY_FIELD_CY } from '../../../config/selectors';
import {
  DEFAULT_MARGIN,
  GRAASP_VIOLET,
} from '../../../config/stylingConstants';
import Highlighted from './Highlighted';

type Prop = {
  text: string;
  highlight: boolean;
  openChatbot: () => void;
  keywords: string[];
  width?: string;
};

// eslint-disable-next-line arrow-body-style
const TextDisplay: FC<Prop> = ({
  text,
  highlight,
  keywords,
  openChatbot,
  width,
  // eslint-disable-next-line arrow-body-style
}) => {
  return (
    <Typography
      data-cy={TEXT_DISPLAY_FIELD_CY}
      variant="body1"
      sx={{
        margin: DEFAULT_MARGIN,
        border: `2px solid ${GRAASP_VIOLET}`,
        borderRadius: '10px',
        padding: '25px',
        flex: 2,
        width,
        whiteSpace: 'pre-line',
      }}
    >
      <Highlighted
        text={text}
        words={keywords}
        highlight={highlight}
        openChatbot={openChatbot}
      />
    </Typography>
  );
};

export default TextDisplay;
