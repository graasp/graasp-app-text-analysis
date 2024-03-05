import { FC } from 'react';

import { Box } from '@mui/material';

import { Keyword, KeywordWithLabel } from '../../../config/appSettingTypes';
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
  openChatbot: (word: KeywordWithLabel) => void;
  keywords: Keyword[];
  width?: string;
};

const TextDisplay: FC<Prop> = ({
  text,
  highlight,
  keywords,
  openChatbot,
  width,
}) => (
  <Box
    data-cy={TEXT_DISPLAY_FIELD_CY}
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
  </Box>
);

export default TextDisplay;
