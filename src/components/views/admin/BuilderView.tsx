import { FC, useState } from 'react';

import { Box, Typography } from '@mui/material';

import {
  INITIAL_CHATBOT_PROMPT_SETTING_KEY,
  INITIAL_PROMPT_SETTING_KEY,
  LESSON_TITLE_SETTING_KEY,
  TEXT_RESOURCE_SETTING_KEY,
} from '../../../config/appSettingTypes';
import {
  BUILDER_VIEW_CY,
  INITIAL_CHATBOT_PROMPT_BUTTON_CY,
  INITIAL_CHATBOT_PROMPT_INPUT_FIELD_CY,
  INITIAL_PROMPT_BUTTON_CY,
  INITIAL_PROMPT_INPUT_FIELD_CY,
  SAVE_TEXT_BUTTON_CY,
  SAVE_TITLE_BUTTON_CY,
  TEXT_INPUT_FIELD_CY,
  TITLE_INPUT_FIELD_CY,
} from '../../../config/selectors';
import PublicAlert from '../../common/PublicAlert';
import KeyWords from '../../common/settings/KeyWords';
import SetText from '../../common/settings/SetText';
import SwitchModes from '../../common/settings/SwitchModes';

// eslint-disable-next-line arrow-body-style
const BuilderView: FC = () => {
  const [displayChatbot, setDisplayChatbot] = useState(false);

  const updateDisplayChatbot = (display: boolean): void => {
    setDisplayChatbot(display);
  };

  return (
    <div data-cy={BUILDER_VIEW_CY}>
      <PublicAlert />
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
        multiline
        minRows={2}
        textFieldLabel="Enter the text students will see"
      />
      <SwitchModes onChange={updateDisplayChatbot} />
      <Box display={displayChatbot ? 'block' : 'none'}>
        <SetText
          textDataCy={INITIAL_PROMPT_INPUT_FIELD_CY}
          buttonDataCy={INITIAL_PROMPT_BUTTON_CY}
          resourceKey={INITIAL_PROMPT_SETTING_KEY}
          multiline
          textFieldLabel="Enter the intial prompt describing the conversation (as a template for {{keyword}})"
        />
        <SetText
          textDataCy={INITIAL_CHATBOT_PROMPT_INPUT_FIELD_CY}
          buttonDataCy={INITIAL_CHATBOT_PROMPT_BUTTON_CY}
          resourceKey={INITIAL_CHATBOT_PROMPT_SETTING_KEY}
          multiline
          textFieldLabel="Enter the chatbot's first line (as a template for {{keyword}})"
        />
        <KeyWords />
      </Box>
    </div>
  );
};

export default BuilderView;
