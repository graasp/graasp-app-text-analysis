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
  CHATBOT_CONTAINER_CY,
  INITIAL_CHATBOT_PROMPT_BUTTON_CY,
  INITIAL_CHATBOT_PROMPT_INPUT_FIELD_CY,
  INITIAL_PROMPT_BUTTON_CY,
  INITIAL_PROMPT_INPUT_FIELD_CY,
  SAVE_TEXT_BUTTON_CY,
  SAVE_TITLE_BUTTON_CY,
  SETTINGS_SAVE_BUTTON_CY,
  TEXT_INPUT_FIELD_CY,
  TITLE_INPUT_FIELD_CY,
} from '../../../config/selectors';
import { DEFAULT_MARGIN } from '../../../config/stylingConstants';
import PublicAlert from '../../common/PublicAlert';
import GraaspButton from '../../common/settings/GraaspButton';
import KeyWords from '../../common/settings/KeyWords';
import SetText from '../../common/settings/SetText';
import SwitchModes from '../../common/settings/SwitchModes';
import { useObserver } from '../../context/ObserverContext';

// eslint-disable-next-line arrow-body-style
const BuilderView: FC = () => {
  const [chatbotEnabled, setChatbotEnabled] = useState(false);
  const [textStudents, setTextStudents] = useState('');

  const { notifySubscribers } = useObserver();

  const updateEnableChatbot = (enable: boolean): void => {
    setChatbotEnabled(enable);
  };

  const handleTextChange = (text: string): void => {
    setTextStudents(text.toLowerCase());
  };

  const handleButtonClicked = (): void => notifySubscribers();

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
        resourceKey={LESSON_TITLE_SETTING_KEY}
        textFieldLabel="Enter the lesson title"
      />
      <SetText
        textDataCy={TEXT_INPUT_FIELD_CY}
        resourceKey={TEXT_RESOURCE_SETTING_KEY}
        multiline
        minRows={2}
        textFieldLabel="Enter the text students will see"
        onTextChange={handleTextChange}
      />
      <Typography
        variant="h5"
        sx={{
          color: '#5050d2',
          marginLeft: '25px',
        }}
      >
        Chatbot settings
      </Typography>
      <Box marginLeft="30px" marginRight="35px">
        <p>
          If enabled, it will be possible to ask questions about the keywords
          directly in the chat. Otherwise, the definitions will be displayed.
        </p>
      </Box>
      <SwitchModes onChange={updateEnableChatbot} />
      {chatbotEnabled && (
        <Box data-cy={CHATBOT_CONTAINER_CY}>
          <SetText
            textDataCy={INITIAL_PROMPT_INPUT_FIELD_CY}
            resourceKey={INITIAL_PROMPT_SETTING_KEY}
            multiline
            textFieldLabel="Enter the intial prompt describing the conversation (as a template for {{keyword}})"
          />
          <SetText
            textDataCy={INITIAL_CHATBOT_PROMPT_INPUT_FIELD_CY}
            resourceKey={INITIAL_CHATBOT_PROMPT_SETTING_KEY}
            multiline
            textFieldLabel="Enter the chatbot's first line (as a template for {{keyword}})"
          />
        </Box>
      )}
      <Typography
        variant="h5"
        sx={{
          color: '#5050d2',
          margin: '25px',
        }}
      >
        Keywords settings
      </Typography>
      <KeyWords textStudents={textStudents} chatbotEnabled={chatbotEnabled} />

      <Box
        component="span"
        justifyContent="flex-end"
        display="flex"
        sx={{ margin: DEFAULT_MARGIN }}
      >
        <GraaspButton
          buttonDataCy={SETTINGS_SAVE_BUTTON_CY}
          handleOnClick={handleButtonClicked}
          sx={{
            xs: { margin: DEFAULT_MARGIN },
            sm: { margin: DEFAULT_MARGIN },
          }}
          minHeight="55px"
          disabled={false}
          text="Save"
        />
      </Box>
    </div>
  );
};

export default BuilderView;
