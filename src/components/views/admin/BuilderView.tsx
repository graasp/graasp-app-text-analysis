import { FC } from 'react';

import { Typography } from '@mui/material';

import {
  LESSON_TITLE_KEY,
  TEXT_RESOURCE_KEY,
} from '../../../config/appSettingTypes';
import SetText from '../../SetText';

// eslint-disable-next-line arrow-body-style
const BuilderView: FC = () => {
  return (
    <>
      <Typography
        variant="h4"
        sx={{
          color: '#5050d2',
          margin: '25px',
        }}
      >
        Prepare Your Lesson
      </Typography>
      <SetText
        resourceKey={LESSON_TITLE_KEY}
        textFieldLabel="Enter the lesson title"
      />
      <SetText
        resourceKey={TEXT_RESOURCE_KEY}
        textFieldLabel="Enter the text students will see"
      />
    </>
  );
};

export default BuilderView;
