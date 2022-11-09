import { FC } from 'react';

import { Typography } from '@mui/material';

import {
  LESSON_TITLE_SETTING_KEY,
  TEXT_RESOURCE_SETTING_KEY,
} from '../../../config/appSettingTypes';
import {
  BUILDER_VIEW_CY,
  SAVE_TEXT_BUTTON_CY,
  SAVE_TITLE_BUTTON_CY,
  TEXT_INPUT_FIELD_CY,
  TITLE_INPUT_FIELD_CY,
} from '../../../config/selectors';
import KeyWords from '../../KeyWords';
import SetText from '../../SetText';

// eslint-disable-next-line arrow-body-style
const BuilderView: FC = () => {
  return (
    <div data-cy={BUILDER_VIEW_CY}>
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
        textDataCy={TITLE_INPUT_FIELD_CY}
        buttonDataCy={SAVE_TITLE_BUTTON_CY}
        resourceKey={LESSON_TITLE_SETTING_KEY}
        textFieldLabel="Enter the lesson title"
      />
      <SetText
        textDataCy={TEXT_INPUT_FIELD_CY}
        buttonDataCy={SAVE_TEXT_BUTTON_CY}
        resourceKey={TEXT_RESOURCE_SETTING_KEY}
        textFieldLabel="Enter the text students will see"
      />
      <KeyWords />
    </div>
  );
};

export default BuilderView;
