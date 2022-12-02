/* eslint-disable arrow-body-style */
import { FC, useEffect, useState } from 'react';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RedditIcon from '@mui/icons-material/Reddit';
import { Box, styled } from '@mui/material';

import { APP_DATA_TYPES, MessageData } from '../../config/appDataTypes';
import {
  INITIAL_PROMPT_SETTING_KEY,
  TextResourceData,
} from '../../config/appSettingTypes';
import { DEFAULT_INITIAL_PROMPT } from '../../config/appSettings';
import { CHATBOT_RESPONSE_URL } from '../../config/constants';
import {
  GRAASP_VIOLET,
  GRAY,
  LIGHT_GRAY,
  LIGHT_VIOLET,
} from '../../config/stylingConstants';
import { useAppDataContext } from '../context/AppDataContext';
import { useAppSettingContext } from '../context/AppSettingContext';
import InputBar from './InputBar';

const StyledMessage = styled(Box)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  width: '70%',
  margin: theme.spacing(1),
  padding: theme.spacing(1),
  display: 'flex',
  flexWrap: 'wrap',
}));

const StyledBotMessage = styled(StyledMessage)(() => ({
  backgroundColor: LIGHT_VIOLET,
}));

const StyledUserMessage = styled(StyledMessage)(() => ({
  backgroundColor: LIGHT_GRAY,
}));

type Prop = { focusWord: string };

const ChatBox: FC<Prop> = ({ focusWord }) => {
  const { postAppData, appDataArray } = useAppDataContext();
  const { appSettingArray } = useAppSettingContext();

  const initialPrompt = (
    (appSettingArray.find((s) => s.name === INITIAL_PROMPT_SETTING_KEY)?.data ||
      DEFAULT_INITIAL_PROMPT) as TextResourceData
  ).text.replace('keyword', focusWord);

  const [userPrompt, setUserPrompt] = useState('');
  const [completion, setCompletion] = useState('');
  const [loading, setLoading] = useState(false);

  const chatAppData = appDataArray.filter(
    (data) =>
      data.type === APP_DATA_TYPES.BOT_COMMENT ||
      data.type === APP_DATA_TYPES.STUDENT_COMMENT,
  );

  useEffect(() => {
    const chatConcatMessages = chatAppData
      .map((data) => `${data.type}:${(data.data as MessageData).message}`)
      .unshift(initialPrompt)
      .join('\n\n');
    console.log(chatConcatMessages);
    setUserPrompt(chatConcatMessages);
  }, [appDataArray]);

  const fetchApi = async (): Promise<any> => {
    setLoading(true);
    const response = await fetch(CHATBOT_RESPONSE_URL, {
      method: 'POST',
      body: JSON.stringify({ prompt: userPrompt }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    const json = await response.json();
    return json;
  };

  const onSend = (): void => {
    fetchApi().then((json) => {
      console.log(json);
      setCompletion(json.completion);
      setLoading(false);
    });
    postAppData({
      data: { message: completion },
      type: APP_DATA_TYPES.BOT_COMMENT,
    });
  };

  return (
    <Box display="flex" flexDirection="column">
      {chatAppData.map((msg) => {
        const isUser = msg.type === APP_DATA_TYPES.STUDENT_COMMENT;
        if (isUser) {
          return (
            <Box
              key={msg.id}
              display="flex"
              flexDirection="row-reverse"
              alignItems="center"
            >
              <AccountCircleIcon
                sx={{
                  marginRight: '5px',
                  color: GRAY,
                  fontSize: 50,
                }}
              />
              <StyledUserMessage key={msg.id} alignSelf="flex-end">
                {(msg.data as MessageData).message}
              </StyledUserMessage>
            </Box>
          );
        }
        return (
          <Box
            key={msg.id}
            display="flex"
            flexDirection="row"
            alignItems="center"
          >
            <RedditIcon
              sx={{
                marginLeft: '5px',
                color: GRAASP_VIOLET,
                fontSize: 50,
              }}
            />
            <StyledBotMessage key={msg.id} alignSelf="flex-start">
              {loading ? '...' : (msg.data as MessageData).message}
            </StyledBotMessage>
          </Box>
        );
      })}
      <InputBar onSend={onSend} />
    </Box>
  );
};

export default ChatBox;
