import { FC } from 'react';

import { Typography } from '@mui/material';

import { keyword } from '../../../config/appSettingTypes';
import { TEXT_DISPLAY_FIELD_CY } from '../../../config/selectors';
import {
  DEFAULT_BORDER_RADIUS,
  DEFAULT_MARGIN,
  GRAASP_VIOLET,
} from '../../../config/stylingConstants';
import Highlighted from './Highlighted';

type Prop = {
  text: string;
  highlight: boolean;
  openChatbot: (word: keyword) => void;
  keywords: keyword[];
  width?: string;
};

const TextDisplay: FC<Prop> = ({
  text,
  highlight,
  keywords,
  openChatbot,
  width,
}) => (
  <Typography
    data-cy={TEXT_DISPLAY_FIELD_CY}
    variant="body1"
    sx={{
      margin: DEFAULT_MARGIN,
      marginBottom: 0,
      border: `2px solid ${GRAASP_VIOLET}`,
      borderRadius: DEFAULT_BORDER_RADIUS,
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

export default TextDisplay;
