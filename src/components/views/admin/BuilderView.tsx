import { FC, useEffect, useState } from 'react';

import { Alert, Box, Typography } from '@mui/material';

import {
  INITIAL_CHATBOT_PROMPT_SETTING_KEY,
  INITIAL_PROMPT_SETTING_KEY,
  KEYWORDS_SETTING_KEY,
  LESSON_TITLE_SETTING_KEY,
  TEXT_RESOURCE_SETTING_KEY,
} from '../../../config/appSettingTypes';
import {
  BUILDER_VIEW_CY,
  CHATBOT_CONTAINER_CY,
  INITIAL_CHATBOT_PROMPT_INPUT_FIELD_CY,
  INITIAL_PROMPT_INPUT_FIELD_CY,
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
  const [settingsChanged, setSettingsChanged] = useState<Map<string, boolean>>(
    new Map(),
  );
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);

  const { notifySubscribers } = useObserver();

  const updateSettingChanged = (key: string, hasChanged: boolean): void => {
    setSettingsChanged((prevSettingsChanged) => ({
      ...prevSettingsChanged,
      [key]: hasChanged,
    }));
  };

  const handleTextChange = (text: string, hasChanged: boolean): void => {
    setTextStudents(text.toLowerCase());
    updateSettingChanged(TEXT_RESOURCE_SETTING_KEY, hasChanged);
  };

  const handleButtonClicked = (): void => {
    notifySubscribers();
    setSettingsChanged(new Map());
  };

  useEffect(() => {
    setSaveButtonDisabled(
      Object.values(settingsChanged).filter((v) => v).length === 0,
    );
  }, [settingsChanged]);
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
      <Alert severity="warning" sx={{ margin: DEFAULT_MARGIN }}>
        Do not forget to save your work with the save button at the bottom of
        this page.
      </Alert>
      <SetText
        textDataCy={TITLE_INPUT_FIELD_CY}
        resourceKey={LESSON_TITLE_SETTING_KEY}
        textFieldLabel="Enter the lesson title"
        onTextChange={(_, hasChanged) =>
          updateSettingChanged(LESSON_TITLE_SETTING_KEY, hasChanged)
        }
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
      <SwitchModes onChange={setChatbotEnabled} />
      {chatbotEnabled && (
        <Box data-cy={CHATBOT_CONTAINER_CY}>
          <SetText
            textDataCy={INITIAL_PROMPT_INPUT_FIELD_CY}
            resourceKey={INITIAL_PROMPT_SETTING_KEY}
            multiline
            textFieldLabel="Enter the intial prompt describing the conversation (as a template for {{keyword}})"
            onTextChange={(_, hasChanged) =>
              updateSettingChanged(INITIAL_PROMPT_SETTING_KEY, hasChanged)
            }
          />
          <SetText
            textDataCy={INITIAL_CHATBOT_PROMPT_INPUT_FIELD_CY}
            resourceKey={INITIAL_CHATBOT_PROMPT_SETTING_KEY}
            multiline
            textFieldLabel="Enter the chatbot's first line (as a template for {{keyword}})"
            onTextChange={(_, hasChanged) =>
              updateSettingChanged(
                INITIAL_CHATBOT_PROMPT_SETTING_KEY,
                hasChanged,
              )
            }
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
      <KeyWords
        textStudents={textStudents}
        chatbotEnabled={chatbotEnabled}
        onChanges={(hasChanged) =>
          updateSettingChanged(KEYWORDS_SETTING_KEY, hasChanged)
        }
      />

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
          disabled={saveButtonDisabled}
          text="Save"
        />
      </Box>
    </div>
  );
};

export default BuilderView;
